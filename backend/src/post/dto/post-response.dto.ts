import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';
import { TagResponseDto } from '../../tag/dto/tag-response.dto';
import { MediaResponseDto } from 'src/media/dto/media-response.dto';

// Nested DTOs for better Swagger documentation
export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com'
  })
  @Expose()
  email: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
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
    description: 'Category slug',
    example: 'technology'
  })
  @Expose()
  slug: string;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Unique post identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    maxLength: 255
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Post slug (URL-friendly version of title)',
    example: 'getting-started-with-nestjs',
    maxLength: 255
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the main content of the post...'
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED
  })
  @Expose()
  post_status: PostStatus;

  @ApiProperty({
    description: 'Post summary',
    example: 'A brief summary of the post content',
    required: false,
    maxLength: 500
  })
  @Expose()
  summary: string;

  @ApiProperty({
    description: 'Publication date',
    example: '2024-01-01T00:00:00.000Z',
    required: false
  })
  @Expose()
  published_at: Date;

  @ApiProperty({
    description: 'Entity status',
    enum: Status,
    example: Status.ACTIVE
  })
  @Expose()
  status: Status;

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

  @ApiProperty({
    description: 'Post author information',
    type: UserResponseDto
  })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({
    description: 'Post categories',
    type: [CategoryResponseDto]
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: 'Post tags',
    type: [TagResponseDto]
  })
  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @ApiProperty({
    description: 'Post media (featured image)',
    type: MediaResponseDto,
    required: false
  })
  @Expose()
  media_id?: string;
}
