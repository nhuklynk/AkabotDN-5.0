import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'NestJS'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Tag slug',
    example: 'nestjs'
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Articles, tutorials, and resources related to NestJS framework',
    required: false
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z'
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z'
  })
  @Expose()
  updated_at: Date;

  constructor(partial: Partial<TagResponseDto>) {
    Object.assign(this, partial);
  }
}
