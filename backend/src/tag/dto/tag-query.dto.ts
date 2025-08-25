import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class TagQueryDto {
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
    description: 'Number of tags per page (maximum 100). Default is 10 if not specified.',
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
    description: 'Filter tags by name using partial match (case-insensitive). Example: "nest" will match "NestJS", "NestJS Tutorial", etc.',
    example: 'nest',
    examples: {
      nestjs: { value: 'nest', summary: 'Search for NestJS related tags' },
      tutorial: { value: 'tutorial', summary: 'Search for tutorial tags' },
      api: { value: 'api', summary: 'Search for API related tags' }
    }
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter tags by slug using partial match (case-insensitive). Example: "web" will match "web-development", "web-design", etc.',
    example: 'web',
    examples: {
      web: { value: 'web', summary: 'Web development tags' },
      mobile: { value: 'mobile', summary: 'Mobile development tags' },
      design: { value: 'design', summary: 'Design related tags' }
    }
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Search across multiple fields (name, description, slug) using partial match (case-insensitive). This is useful for general text search.',
    example: 'development',
    examples: {
      development: { value: 'development', summary: 'Search for development related tags' },
      framework: { value: 'framework', summary: 'Search for framework tags' },
      language: { value: 'language', summary: 'Search for programming language tags' }
    }
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter tags by creation date range (start date). Format: YYYY-MM-DD',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  date_from?: string;

  @ApiPropertyOptional({
    description: 'Filter tags by creation date range (end date). Format: YYYY-MM-DD',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsString()
  date_to?: string;
}
