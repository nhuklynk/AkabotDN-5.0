import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The name of the category. This is the display name that will be shown to users.',
    example: 'Web Development',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The unique slug identifier for the category. This is used in URLs and must be unique across all categories. Should be URL-friendly (lowercase, hyphens instead of spaces).',
    example: 'web-development',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the category. This helps users understand what content belongs in this category.',
    example: 'Articles, tutorials, and resources related to web development technologies and practices.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The UUID of the parent category. If provided, this category will be a subcategory of the specified parent. Leave empty for root-level categories.',
    example: '550e8400-e29b-41d4-a716-446655440201',
  })
  @IsOptional()
  @IsUUID()
  parent_id?: string;
}
