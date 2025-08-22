import { Expose } from 'class-transformer';

export class TagResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  constructor(partial: Partial<TagResponseDto>) {
    Object.assign(this, partial);
  }
}
