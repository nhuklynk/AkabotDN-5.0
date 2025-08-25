import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { PostStatus } from '../entity/post.entity';
import { Type } from 'class-transformer';

export class PostQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination (starts from 1). Default is 1 if not specified.',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of posts per page (maximum 100). Default is 10 if not specified.',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter posts by publication status. Only returns posts with the specified status.',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
    examples: {
      draft: { value: PostStatus.DRAFT, summary: 'Draft posts only' },
      published: { value: PostStatus.PUBLISHED, summary: 'Published posts only' },
      archived: { value: PostStatus.ARCHIVED, summary: 'Archived posts only' }
    }
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({
    description: 'Filter posts by category slug. Only returns posts that belong to the specified category.',
    example: 'technology',
    examples: {
      technology: { value: 'technology', summary: 'Technology category posts' },
      business: { value: 'business', summary: 'Business category posts' },
      education: { value: 'education', summary: 'Education category posts' }
    }
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by tag slug. Only returns posts that have the specified tag.',
    example: 'nestjs',
    examples: {
      nestjs: { value: 'nestjs', summary: 'Posts tagged with NestJS' },
      typescript: { value: 'typescript', summary: 'Posts tagged with TypeScript' },
      javascript: { value: 'javascript', summary: 'Posts tagged with JavaScript' }
    }
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Search posts by title or content using partial match (case-insensitive). This performs a text search across post titles and content.',
    example: 'NestJS',
    examples: {
      nestjs: { value: 'NestJS', summary: 'Search for NestJS related posts' },
      tutorial: { value: 'tutorial', summary: 'Search for tutorial posts' },
      api: { value: 'API', summary: 'Search for API related posts' }
    }
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by author ID. Only returns posts written by the specified user.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  author_id?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by creation date range (start date). Format: YYYY-MM-DD',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Filter posts by creation date range (end date). Format: YYYY-MM-DD',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsString()
  date_to?: string;
}
