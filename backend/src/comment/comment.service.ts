import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    const comment = this.commentRepository.create(createCommentDto);
    const savedComment = await this.commentRepository.save(comment);
    return this.findOne(savedComment.id);
  }

  async findAll(): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      relations: ['post'],
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ['post'],
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

    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    await this.commentRepository.remove(comment);
  }

  async findByPost(post_id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: post_id } },
      relations: ['post'],
    });
    return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  }

  // TODO: Re-enable these methods after adding self-referencing relationships
  // async findRootComments(post_id: string): Promise<CommentResponseDto[]> {
  //   const comments = await this.commentRepository.find({
  //     where: {
  //       post: { post_id: post_id },
  //       parent: IsNull()
  //     },
  //     relations: ['replies'],
  //   });
  //   return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  // }

  // async findReplies(comment_id: string): Promise<CommentResponseDto[]> {
  //   const comments = await this.commentRepository.find({
  //     where: { parent: { comment_id: comment_id } },
  //     relations: ['replies'],
  //   });
  //   return comments.map(comment => plainToClass(CommentResponseDto, comment, { excludeExtraneousValues: true }));
  // }
}
