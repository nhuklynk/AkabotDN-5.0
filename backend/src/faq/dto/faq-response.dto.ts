import { Expose, Type } from 'class-transformer';

export class FaqResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

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
  parent?: any;

  constructor(partial: Partial<FaqResponseDto>) {
    Object.assign(this, partial);
  }
}
