import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class CategoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by category name (partial match)',
    example: 'tech',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by category slug (partial match)',
    example: 'web',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Filter by parent category ID',
    example: '550e8400-e29b-41d4-a716-446655440201',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['active', 'inactive', 'deleted', 'draft', 'published', 'archived'],
    example: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Search in name, description, and slug',
    example: 'development',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
