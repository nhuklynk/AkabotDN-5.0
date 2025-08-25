import { IsString, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Post slug (URL-friendly version of title)',
    example: 'getting-started-with-nestjs',
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the main content of the post...',
    minLength: 1
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.DRAFT,
    required: false,
    default: PostStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(PostStatus)
  post_status?: PostStatus;

  @ApiProperty({
    description: 'Post summary',
    example: 'A brief summary of the post content',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'Publication date (ISO string)',
    example: '2024-01-01T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @ApiProperty({
    description: 'Primary media ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  primary_media_id?: string;

  @ApiProperty({
    description: 'Category IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  category_ids?: string[];

  @ApiProperty({
    description: 'Tag IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsUUID(undefined, { each: true })
  tag_ids?: string[];

  @ApiProperty({
    description: 'Entity status',
    enum: Status,
    example: Status.ACTIVE,
    required: false,
    default: Status.ACTIVE
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    description: 'Media ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsOptional()
  @IsUUID()
  media_id?: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @IsUUID()
  user_id: string;
}
