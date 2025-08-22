import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entity/post.entity';

export class PostResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique post identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  post_id: string;

  @Expose()
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS'
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Post slug (URL-friendly version of title)',
    example: 'getting-started-with-nestjs'
  })
  slug: string;

  @Expose()
  @ApiProperty({
    description: 'Post content',
    example: 'This is the main content of the post...'
  })
  content: string;

  @Expose()
  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED
  })
  status: PostStatus;

  @Expose()
  @ApiProperty({
    description: 'Post summary',
    example: 'A brief summary of the post content',
    required: false
  })
  summary: string;

  @Expose()
  @ApiProperty({
    description: 'Publication date',
    example: '2024-01-01T00:00:00.000Z',
    required: false
  })
  published_at: Date;

  @Expose()
  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: Date;

  @Expose()
  @ApiProperty({
    description: 'Post author information'
  })
  author: any;

  @Expose()
  @ApiProperty({
    description: 'Primary media for the post',
    required: false
  })
  primary_media: any;

  @Expose()
  @ApiProperty({
    description: 'Post categories',
    type: 'array'
  })
  categories: any[];

  @Expose()
  @ApiProperty({
    description: 'Post tags',
    type: 'array'
  })
  tags: any[];
}
