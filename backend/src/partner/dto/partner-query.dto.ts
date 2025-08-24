import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PartnerType } from '../entity/partner.entity';

export class PartnerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for partner name or description',
    example: 'tech company',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by partner type',
    enum: PartnerType,
    example: PartnerType.GOLD,
  })
  @IsOptional()
  @IsEnum(PartnerType)
  partner_type?: PartnerType;
}
