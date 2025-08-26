import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/config/base-audit.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    // Create comment with proper relationship mapping
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      comment_type: createCommentDto.comment_type,
      comment_type_id: createCommentDto.comment_type_id,
      ...(createCommentDto.parent_id && { parent: { id: createCommentDto.parent_id } }),
      ...(createCommentDto.author_id && { author: { id: createCommentDto.author_id } }),
    });
    
    const savedComment = await this.commentRepository.save(comment);
    return plainToClass(CommentResponseDto, savedComment, { excludeExtraneousValues: true });
  }

  async findPaginated(skip: number, take: number): Promise<[CommentResponseDto[], number]> {
    const [comments, total] = await this.commentRepository.findAndCount({
      relations: ['author'],
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const commentDtos = comments.map(comment => 
      plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true })
    );

    return [commentDtos, total];
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
    const comment = await this.commentRepository.findOne({
      where: { id: id },
    });

    if (comment) {
      comment.status = Status.INACTIVE;
      await this.commentRepository.save(comment);
    }
  }

  async findByPost(post_id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { comment_type_id: post_id },
      relations: ['author'],
      order: { created_at: 'DESC' },
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }

  async findRootComments(post_id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: {
        comment_type_id: post_id,
        parent: IsNull()
      },
      relations: ['author'],
      order: { created_at: 'DESC' },
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }

  async findReplies(comment_id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { parent: { id: comment_id } },
      relations: ['author'],
      order: { created_at: 'ASC' },
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }
}
