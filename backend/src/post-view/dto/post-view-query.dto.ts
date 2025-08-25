import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class PostViewQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by post ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString()
  post_id?: string;

  @ApiPropertyOptional({
    description: 'Filter views from this date',
    example: '2023-12-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiPropertyOptional({
    description: 'Filter views to this date',
    example: '2023-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  to_date?: string;
}
