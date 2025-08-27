import { Expose, Type } from 'class-transformer';
import { Status } from '../../config/base-audit.entity';
import { UserResponseDto } from 'src/user/dto/user/user-response.dto';
import { CommentType } from '../entity/comment.entity';

export class CommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  comment_type: CommentType;

  @Expose()
  comment_type_id: string;

  @Expose()
  status: Status;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  created_by: string;

  @Expose()
  modified_by: string;

  @Expose()
  @Type(() => Object)
  post?: any;

  @Expose()
  @Type(() => CommentResponseDto)
  replies: CommentResponseDto[];

  @Expose()
  @Type(() => UserResponseDto)
  author?: UserResponseDto;

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
    this.replies = this.replies || [];
  }
}
