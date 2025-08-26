import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { EventStatus } from '../entity/event.entity';
import { Status } from 'src/config/base-audit.entity';

export class EventQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by event title (partial match)',
    example: 'AI Conference'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filter by location (partial match)',
    example: 'Hanoi'
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Filter by publication status',
    enum: Status,
    example: Status.ACTIVE
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    description: 'Filter events starting from this date',
    example: '2024-12-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Filter events starting before this date',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Filter by tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  tag_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by countdown enabled',
    example: true
  })
  @IsOptional()
  countdown_enabled?: boolean;
}
