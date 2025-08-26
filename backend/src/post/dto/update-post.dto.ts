// import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { PostStatus } from '../entity/post.entity';

// export class UpdatePostDto {
//   @ApiProperty({ description: 'Post title', required: false })
//   @IsOptional()
//   @IsString()
//   title?: string;

//   @ApiProperty({ description: 'Slug', required: false })
//   @IsOptional()
//   @IsString()
//   slug?: string;

//   @ApiProperty({ description: 'Content', required: false })
//   @IsOptional()
//   @IsString()
//   content?: string;

//   @ApiProperty({ description: 'Summary', required: false })
//   @IsOptional()
//   @IsString()
//   summary?: string;

//   @ApiProperty({ description: 'Post status', required: false, enum: PostStatus })
//   @IsOptional()
//   @IsEnum(PostStatus)
//   post_status?: PostStatus;

//   @ApiProperty({
//     description: 'Published date (ISO string)',
//     required: false,
//     example: '2025-08-25T12:00:00.000Z',
//   })
//   @IsOptional()
//   @IsString()
//   published_at?: string;

//   @ApiProperty({ description: 'User ID', required: false })
//   @IsOptional()
//   @IsUUID()
//   user_id?: string;

//   @ApiProperty({
//     description: 'Category IDs (comma-separated string)',
//     required: false,
//     example: 'cat-uuid-1,cat-uuid-2',
//   })
//   @IsOptional()
//   @IsString()
//   category_ids?: string;

//   @ApiProperty({
//     description: 'Tag IDs (comma-separated string)',
//     required: false,
//     example: 'tag-uuid-1,tag-uuid-2',
//   })
//   @IsOptional()
//   @IsString()
//   tag_ids?: string;

//   @ApiProperty({ description: 'Media ID', required: false })
//   @IsOptional()
//   @IsUUID()
//   media_id?: string;
// }

import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '../entity/post.entity';

export class UpdatePostFormdataDto {
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
    description: 'Category IDs (comma-separated string)',
    example: '123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b789-123456789abc',
    required: false
  })
  @IsOptional()
  @IsString()
  category_ids?: string;

  @ApiProperty({
    description: 'Tag IDs (comma-separated string)',
    example: '123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43d1-b789-123456789abc',
    required: false
  })
  @IsOptional()
  @IsString()
  tag_ids?: string;

  @ApiProperty({
    description: 'Post featured image',
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
  featured_image?: any;

  @ApiProperty({
    description: 'Post published at',
    example: '2024-01-01T00:00:00.000Z',
    required: false
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @IsUUID()
  user_id: string;
}
