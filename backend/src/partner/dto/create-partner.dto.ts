import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { PartnerType } from '../entity/partner.entity';

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsEnum(PartnerType)
  partner_type?: PartnerType;
}
