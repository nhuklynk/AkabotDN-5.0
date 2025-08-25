import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { PartnerType } from '../entity/partner.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @ApiProperty({
    description: 'The name of the partner',
    example: 'Google',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The logo of the partner',
    example: 'https://www.google.com/logo.png',
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    description: 'The website of the partner',
    example: 'https://www.google.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'The type of the partner',
    example: 'strategic',
  })
  @IsOptional()
  @IsEnum(PartnerType)
  partner_type?: PartnerType;
}
