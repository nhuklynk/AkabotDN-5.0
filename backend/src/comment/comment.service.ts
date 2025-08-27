import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment, CommentType } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { NestedCommentResponseDto } from './dto/nested-comment-response.dto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/config/base-audit.entity';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    let author: User | null = null;
    let parentComment: Comment | null = null;
  
    // Validate author exists if author_id is provided
    if (createCommentDto.author_id) {
      author = await this.userRepository.findOne({
        where: { id: createCommentDto.author_id },
      });
      if (!author) {
        throw new BadRequestException(
          `User with ID ${createCommentDto.author_id} not found`,
        );
      }
    }
  
    // Handle parent_id: nếu có thì validate, nếu không thì null
    if (createCommentDto.parent_id) {
      parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.parent_id },
      });
      if (!parentComment) {
        throw new BadRequestException(
          `Parent comment with ID ${createCommentDto.parent_id} not found`,
        );
      }
    } else {
      parentComment = null; // không truyền thì gán null
    }
  
    // Create comment
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      comment_type: createCommentDto.comment_type as CommentType,
      comment_type_id: createCommentDto.comment_type_id,
      author: author || undefined,
      parent: parentComment || undefined,
    });
  
    const savedComment = await this.commentRepository.save(comment);
    return plainToClass(CommentResponseDto, savedComment, {
      excludeExtraneousValues: true,
    });
  }
  
  async findFilteredAndPaginated(query: CommentQueryDto): Promise<[CommentResponseDto[], number]> {
    const { page = 1, limit = 10, post_id, parent_id, user_id, search, date_from, date_to, root_only } = query;
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author');
  
    if (parent_id) {
      queryBuilder.andWhere('comment.parent_id = :parent_id', { parent_id });
    }
  
    if (user_id) {
      queryBuilder.andWhere('author.id = :user_id', { user_id });
    }
  
    if (search) {
      queryBuilder.andWhere('LOWER(comment.content) LIKE LOWER(:search)', { search: `%${search}%` });
    }
  
    if (date_from) {
      queryBuilder.andWhere('comment.created_at >= :date_from', { date_from });
    }
  
    if (date_to) {
      queryBuilder.andWhere('comment.created_at <= :date_to', { date_to });
    }
  
    if (root_only) {
      queryBuilder.andWhere('comment.parent IS NULL');
    }
  
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('comment.created_at', 'DESC');
  
    const [comments, total] = await queryBuilder.getManyAndCount();
  
    const commentDtos = comments.map(comment =>
      plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true })
    );
  
    return [commentDtos, total];
  }  

  async findOne(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const updatedComment = await this.commentRepository.update(id, updateCommentDto);
    return plainToClass(CommentResponseDto, updatedComment, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }

  async findReplies(comment_id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { parent: { id: comment_id } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }

  async findByCommentTypeAndId(comment_type: CommentType, comment_type_id: string): Promise<NestedCommentResponseDto[]> {
    const allComments = await this.commentRepository.find({
      where: {
        comment_type: comment_type,
        comment_type_id: comment_type_id
      },
      relations: ['author', 'parent'],
      order: { created_at: 'DESC' },
    });

    return this.buildCommentTree(allComments);
  }

  private buildCommentTree(comments: Comment[]): NestedCommentResponseDto[] {
    const commentMap = new Map<string, NestedCommentResponseDto>();
    const rootComments: NestedCommentResponseDto[] = [];

    comments.forEach(comment => {
      const nestedComment = plainToClass(NestedCommentResponseDto, comment, { 
        excludeExtraneousValues: true 
      });
      nestedComment.replies = [];
      commentMap.set(comment.id, nestedComment);
    });

    comments.forEach(comment => {
      const nestedComment = commentMap.get(comment.id);
      if (!nestedComment) return;

      if (!comment.parent) {
        rootComments.push(nestedComment);
      } else {
        const parentComment = commentMap.get(comment.parent.id);
        if (parentComment) {
          parentComment.replies.push(nestedComment);
        }
      }
    });

    this.sortRepliesByCreatedAt(rootComments);

    return rootComments;
  }

  private sortRepliesByCreatedAt(comments: NestedCommentResponseDto[]) {
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        this.sortRepliesByCreatedAt(comment.replies);
      }
    });
  }
}
