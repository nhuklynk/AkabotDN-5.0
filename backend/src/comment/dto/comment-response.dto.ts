import { Expose, Type } from 'class-transformer';
import { Status } from '../../config/base-audit.entity';

export class CommentResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  status: Status;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => Object)
  post?: any;

  @Expose()
  @Type(() => Object)
  parent?: any;

  @Expose()
  @Type(() => Array)
  replies?: any[];

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
  }
}
