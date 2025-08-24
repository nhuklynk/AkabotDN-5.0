import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the tag. This is the display name that will be shown to users.',
    example: 'NestJS',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The unique slug identifier for the tag. This is used in URLs and must be unique across all tags. Should be URL-friendly (lowercase, hyphens instead of spaces).',
    example: 'nestjs',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the tag. This helps users understand what content is associated with this tag.',
    example: 'Articles, tutorials, and resources related to NestJS framework',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
