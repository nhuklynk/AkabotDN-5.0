import { Expose, Type } from 'class-transformer';
import { Status } from 'src/config/base-audit.entity';

export class CategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Object)
  parent?: any;

  @Expose()
  @Type(() => Array)
  children?: any[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  status: Status;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
