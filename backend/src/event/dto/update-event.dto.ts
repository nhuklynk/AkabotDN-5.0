import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsEnum } from "class-validator";
import { EventStatus } from "../entity/event.entity";

export class UpdateEventFormdataDto {
  @ApiProperty({ description: 'Event title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Start time (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  start_time?: string;

  @ApiProperty({ description: 'End time (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiProperty({ description: 'Enable countdown', required: false })
  @IsOptional()
  @IsString()
  countdown_enabled?: string;

  @ApiProperty({ description: 'Category IDs (comma-separated)', required: false })
  @IsOptional()
  @IsString()
  category_ids?: string;

  @ApiProperty({ description: 'Tag IDs (comma-separated)', required: false })
  @IsOptional()
  @IsString()
  tag_ids?: string;

  @ApiProperty({ description: 'Thumbnail file', type: 'string', format: 'binary', required: false })
  @IsOptional()
  thumbnail?: any;
}