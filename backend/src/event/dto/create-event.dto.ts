import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsDateString, 
  IsBoolean, 
  MaxLength 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { EventStatus } from '../entity/event.entity';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'AI Conference 2024',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Event slug (unique)',
    example: 'ai-conference-2024',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Join us for the biggest AI conference of the year'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Event location',
    example: 'Hanoi Convention Center',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-12-01T09:00:00.000Z'
  })
  @IsDateString()
  start_time: Date;

  @ApiPropertyOptional({
    description: 'Event end time',
    example: '2024-12-01T17:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  end_time?: Date;

  @ApiPropertyOptional({
    description: 'Thumbnail URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  thumbnail_url_id?: string;

  @ApiPropertyOptional({
    description: 'Whether countdown is enabled',
    example: true,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  countdown_enabled?: boolean = false;

  @ApiPropertyOptional({
    description: 'Event publication status',
    enum: EventStatus,
    example: EventStatus.DRAFT,
    default: EventStatus.DRAFT
  })
  @IsOptional()
  @IsEnum(EventStatus)
  public_status?: EventStatus = EventStatus.DRAFT;

  @ApiPropertyOptional({
    description: 'Array of tag IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value === null ? [] : value)
  tag_ids?: string[] = [];

  @ApiPropertyOptional({
    description: 'Array of category IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value === null ? [] : value)
  category_ids?: string[] = [];
}
