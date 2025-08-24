import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class EventQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search term for event title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by event status' })
  @IsOptional()
  @IsString()
  public_status?: string;

  @ApiPropertyOptional({ description: 'Filter by event category ID' })
  @IsOptional()
  @IsUUID()
  event_category_id?: string;

  @ApiPropertyOptional({ description: 'Filter events starting from this date' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'Filter events ending before this date' })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
