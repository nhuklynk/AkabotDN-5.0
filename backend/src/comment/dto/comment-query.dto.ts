import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CommentQueryDto {
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
    description: 'Number of comments per page (maximum 100). Default is 10 if not specified.',
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
    description: 'Filter comments by post ID. Only returns comments that belong to the specified post.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  post_id?: string;

  @ApiPropertyOptional({
    description: 'Filter comments by parent comment ID. Only returns replies to the specified comment.',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiPropertyOptional({
    description: 'Filter comments by author ID. Only returns comments written by the specified user.',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Search across multiple fields (content) using partial match (case-insensitive). This is useful for general text search.',
    example: 'helpful',
    examples: {
      helpful: { value: 'helpful', summary: 'Search for helpful comments' },
      tutorial: { value: 'tutorial', summary: 'Search for tutorial related comments' },
      problem: { value: 'problem', summary: 'Search for problem related comments' }
    }
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter comments by creation date range (start date). Format: YYYY-MM-DD',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Filter comments by creation date range (end date). Format: YYYY-MM-DD',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsString()
  date_to?: string;

  @ApiPropertyOptional({
    description: 'Filter to show only root comments (comments without parent). Useful for displaying top-level comments.',
    example: true,
    default: false
  })
  @IsOptional()
  @Type(() => Boolean)
  root_only?: boolean = false;
}
