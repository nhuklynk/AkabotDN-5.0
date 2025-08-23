import { Expose, Type } from 'class-transformer';

export class FaqResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => Object)
  parent?: any;

  constructor(partial: Partial<FaqResponseDto>) {
    Object.assign(this, partial);
  }
}
