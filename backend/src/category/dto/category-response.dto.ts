import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/config/base-audit.entity';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Technology'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'URL-friendly identifier for the category',
    example: 'technology'
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Detailed description of the category',
    example: 'Articles and content related to technology, software development, and digital innovation',
    required: false
  })
  @Expose()
  description: string;

  @ApiProperty({ 
    description: 'Child categories (if any)',
    type: [CategoryResponseDto],
    required: false 
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  children?: CategoryResponseDto[];

  @ApiProperty({
    description: 'Date when the category was created',
    example: '2024-01-01T00:00:00.000Z'
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Date when the category was last modified',
    example: '2024-01-01T00:00:00.000Z'
  })
  @Expose()
  modified_at: Date;

  @ApiProperty({
    description: 'Current status of the category',
    enum: Status,
    example: Status.ACTIVE
  })
  @Expose()
  status: Status;
}
