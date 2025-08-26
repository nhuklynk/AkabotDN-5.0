import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entity/event.entity';

export class CreateEventFormdataDto {
  @ApiProperty({ description: 'Event title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Slug (unique)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Start time (ISO string)' })
  @IsDateString()
  start_time: string;

  @ApiProperty({ description: 'End time (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiProperty({
    description: 'Enable countdown (true/false)',
    required: false,
    example: 'true',
  })
  @IsOptional()
  @IsString()
  countdown_enabled?: boolean;

  @ApiProperty({
    description: 'Category IDs (comma-separated)',
    required: false,
    example: 'uuid1,uuid2',
  })
  @IsOptional()
  @IsString()
  category_ids?: string;

  @ApiProperty({
    description: 'Tag IDs (comma-separated)',
    required: false,
    example: 'uuid1,uuid2',
  })
  @IsOptional()
  @IsString()
  tag_ids?: string;

  @ApiProperty({
    description: 'Thumbnail file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  thumbnail?: any;
}