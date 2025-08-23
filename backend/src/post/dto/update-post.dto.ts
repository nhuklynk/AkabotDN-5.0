import { IsString, IsOptional, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    required: false,
    minLength: 1,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Post slug (URL-friendly version of title)',
    example: 'getting-started-with-nestjs',
    required: false,
    minLength: 1,
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is the main content of the post...',
    required: false,
    minLength: 1
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Post status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
    required: false
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
  @IsArray()
  @IsUUID('4', { each: true })
  category_ids?: string[];

  @ApiProperty({
    description: 'Tag IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tag_ids?: string[];

  @ApiProperty({
    description: 'Entity status',
    enum: Status,
    example: Status.ACTIVE,
    required: false
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
