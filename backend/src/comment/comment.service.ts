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
  
    const baseQueryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.parent', 'parent');
  
    if (post_id) {
      baseQueryBuilder.andWhere('comment.comment_type_id = :post_id', { post_id });
    }
  
    if (user_id) {
      baseQueryBuilder.andWhere('author.id = :user_id', { user_id });
    }
  
    if (search) {
      baseQueryBuilder.andWhere('LOWER(comment.content) LIKE LOWER(:search)', { search: `%${search}%` });
    }
  
    if (date_from) {
      baseQueryBuilder.andWhere('comment.created_at >= :date_from', { date_from });
    }
  
    if (date_to) {
      baseQueryBuilder.andWhere('comment.created_at <= :date_to', { date_to });
    }

    if (parent_id) {
      baseQueryBuilder.andWhere('comment.parent_id = :parent_id', { parent_id });
      const [comments] = await baseQueryBuilder.orderBy('comment.created_at', 'DESC').getManyAndCount();
      const treeComments = this.buildCommentResponseTree(comments);
      const paginatedComments = treeComments.slice(skip, skip + limit);
      return [paginatedComments, treeComments.length];
    }
  
    baseQueryBuilder.orderBy('comment.created_at', 'DESC');
    const [allComments] = await baseQueryBuilder.getManyAndCount();
  
    const commentGroups = new Map<string, Comment[]>();
    allComments.forEach(comment => {
      const key = comment.comment_type_id;
      if (!commentGroups.has(key)) {
        commentGroups.set(key, []);
      }
      commentGroups.get(key)!.push(comment);
    });

    const allTreeComments: CommentResponseDto[] = [];
    commentGroups.forEach(comments => {
      const treeComments = this.buildCommentResponseTree(comments);
      allTreeComments.push(...treeComments);
    });

    allTreeComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    let filteredComments = allTreeComments;
    if (root_only) {
      filteredComments = allTreeComments;
    }
    const paginatedRootComments = filteredComments.slice(skip, skip + limit);
    
    return [paginatedRootComments, filteredComments.length];
  }  

  async findOne(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['author', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const allRelatedComments = await this.commentRepository.find({
      where: {
        comment_type: comment.comment_type,
        comment_type_id: comment.comment_type_id
      },
      relations: ['author', 'parent'],
      order: { created_at: 'DESC' },
    });

    const treeComments = this.buildCommentResponseTree(allRelatedComments);
    
    const findCommentInTree = (comments: CommentResponseDto[], targetId: string): CommentResponseDto | null => {
      for (const comment of comments) {
        if (comment.id === targetId) {
          return comment;
        }
        if (comment.replies && comment.replies.length > 0) {
          const found = findCommentInTree(comment.replies, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const foundComment = findCommentInTree(treeComments, id);
    return foundComment || plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true });
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
      relations: ['author', 'parent'],
      order: { created_at: 'ASC' },
    });
    
    return this.buildCommentResponseTree(comments);
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

  async findTreeByCommentTypeAndId(comment_type: CommentType, comment_type_id: string): Promise<CommentResponseDto[]> {
    const allComments = await this.commentRepository.find({
      where: {
        comment_type: comment_type,
        comment_type_id: comment_type_id
      },
      relations: ['author', 'parent'],
      order: { created_at: 'DESC' },
    });

    return this.buildCommentResponseTree(allComments);
  }
  
  async createTestReplies(parent_id: string) {
    const parentComment = await this.commentRepository.findOne({
      where: { id: parent_id },
      relations: ['author']
    });

    if (!parentComment) {
      throw new NotFoundException(`Parent comment with ID ${parent_id} not found`);
    }

    const testReplies: Comment[] = [];
    for (let i = 1; i <= 3; i++) {
      const reply = this.commentRepository.create({
        content: `Test reply ${i} to comment ${parent_id}`,
        comment_type: parentComment.comment_type,
        comment_type_id: parentComment.comment_type_id,
        parent: parentComment,
        author: parentComment.author
      });

      const savedReply = await this.commentRepository.save(reply);
      testReplies.push(savedReply);
    }

    const nestedReply = this.commentRepository.create({
      content: `Nested reply to first test reply`,
      comment_type: parentComment.comment_type,
      comment_type_id: parentComment.comment_type_id,
      parent: testReplies[0],
      author: parentComment.author
    });

    const savedNestedReply = await this.commentRepository.save(nestedReply);
    testReplies.push(savedNestedReply);

    return {
      message: 'Test replies created successfully',
      parent_id,
      created_replies: testReplies.map(r => ({
        id: r.id,
        content: r.content,
        parent_id: r.parent?.id
      }))
    };
  }

  private buildCommentResponseTree(comments: Comment[]): CommentResponseDto[] {
    const commentMap = new Map<string, CommentResponseDto>();
    const rootComments: CommentResponseDto[] = [];

    comments.forEach(comment => {
      const commentResponse = plainToClass(CommentResponseDto, comment, { 
        excludeExtraneousValues: true 
      });
      commentResponse.replies = [];
      commentMap.set(comment.id, commentResponse);
    });

    comments.forEach(comment => {
      const commentResponse = commentMap.get(comment.id);
      if (!commentResponse) return;

      if (!comment.parent) {
        rootComments.push(commentResponse);
      } else {
        const parentComment = commentMap.get(comment.parent.id);
        if (parentComment) {
          parentComment.replies.push(commentResponse);
        }
      }
    });

    this.sortCommentRepliesByCreatedAt(rootComments);

    return rootComments;
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

  private sortCommentRepliesByCreatedAt(comments: CommentResponseDto[]) {
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        this.sortCommentRepliesByCreatedAt(comment.replies);
      }
    });
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
