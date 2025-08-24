import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FaqQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for FAQ content',
    example: 'how to',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
