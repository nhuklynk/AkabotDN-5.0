import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TagResponseDto } from 'src/tag/dto/tag-response.dto';
import { CategoryResponseDto } from 'src/category/dto/category-response.dto';

export class EventResponseDto {
  @ApiProperty({
    description: 'Event ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'AI Conference 2024',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Event slug',
    example: 'ai-conference-2024',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Join us for the biggest AI conference of the year',
    nullable: true,
  })
  @Expose()
  description: string | null;

  @ApiProperty({
    description: 'Event location',
    example: 'Hanoi Convention Center',
    nullable: true,
  })
  @Expose()
  location: string | null;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-12-01T09:00:00.000Z',
  })
  @Expose()
  start_time: Date;

  @ApiProperty({
    description: 'Event end time',
    example: '2024-12-01T17:00:00.000Z',
    nullable: true,
  })
  @Expose()
  end_time: Date | null;

  @ApiProperty({
    description: 'Thumbnail URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  @Expose()
  thumbnail_url_id: string | null;

  @ApiProperty({
    description: 'Whether countdown is enabled',
    example: true,
  })
  @Expose()
  countdown_enabled: boolean;

  @ApiProperty({
    description: 'Tags associated with the event',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Technology' },
      },
    },
  })
  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @ApiProperty({
    description: 'Categories associated with the event',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174111' },
        name: { type: 'string', example: 'Conference' },
      },
    },
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-11-10T08:00:00.000Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-11-15T10:30:00.000Z',
  })
  @Expose()
  modified_at: Date;

  @Expose()
  created_by: string;

  @Expose()
  modified_by: string;
}
