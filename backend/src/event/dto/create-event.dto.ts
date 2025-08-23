import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Title of the event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'SEO-friendly slug for the event' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ description: 'Detailed description of the event' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Location of the event' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Start time of the event' })
  @IsDateString()
  start_time: string;

  @ApiPropertyOptional({ description: 'End time of the event' })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiPropertyOptional({ description: 'Thumbnail URL ID for the event' })
  @IsOptional()
  @IsString()
  thumbnailUrlId?: string;

  @ApiPropertyOptional({ description: 'Whether countdown is enabled', default: false })
  @IsOptional()
  @IsBoolean()
  countdown_enabled?: boolean;

  @ApiPropertyOptional({ description: 'Status of the event', enum: ['draft', 'published', 'archived'], default: 'draft' })
  @IsOptional()
  @IsString()
  public_status?: string;

  @ApiPropertyOptional({ description: 'ID of the event category' })
  @IsOptional()
  @IsUUID()
  event_category_id?: string;
}
