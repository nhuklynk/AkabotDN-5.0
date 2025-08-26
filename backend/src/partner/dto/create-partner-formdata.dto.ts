import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { PartnerType } from '../entity/partner.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePartnerFormDataDto {
  @ApiProperty({
    description: 'The name of the partner',
    example: 'Google',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the partner',
    example: 'Google Inc. is a multinational technology company',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Logo file for the partner',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  logo?: any; // File upload

  @ApiProperty({
    description: 'The website of the partner',
    example: 'https://www.google.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'The type of the partner',
    example: 'strategic',
    enum: PartnerType,
    required: false,
  })
  @IsOptional()
  @IsEnum(PartnerType)
  @Transform(({ value }) => value || PartnerType.GOLD)
  partner_type?: PartnerType;

  @ApiProperty({
    description: 'Sort order for displaying partners',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  sort_order?: number;
}
