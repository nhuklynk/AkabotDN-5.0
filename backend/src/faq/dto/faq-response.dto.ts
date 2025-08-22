import { Expose, Type } from 'class-transformer';

export class FaqResponseDto {
  @Expose()
  id: string;

  @Expose()
  question: string;

  @Expose()
  answer: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  @Type(() => Object)
  parent?: any;

  @Expose()
  @Type(() => Array)
  children?: any[];

  constructor(partial: Partial<FaqResponseDto>) {
    Object.assign(this, partial);
  }
}
