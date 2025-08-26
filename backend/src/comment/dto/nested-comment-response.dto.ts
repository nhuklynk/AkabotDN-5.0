import { Expose, Type } from 'class-transformer';
import { Status } from '../../config/base-audit.entity';
import { CommentType } from '../entity/comment.entity';

export class NestedCommentResponseDto {
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
  author?: {
    id: string;
    username: string;
    email: string;
  };

  @Expose()
  @Type(() => NestedCommentResponseDto)
  replies: NestedCommentResponseDto[];

  constructor(partial: Partial<NestedCommentResponseDto>) {
    Object.assign(this, partial);
    this.replies = this.replies || [];
  }
}
