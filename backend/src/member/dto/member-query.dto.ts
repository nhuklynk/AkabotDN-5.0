import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class MemberQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for member name or email',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsString()
  company_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by membership status',
    example: 'active',
    enum: ['active', 'inactive', 'pending'],
  })
  @IsOptional()
  @IsString()
  status?: string;
}
