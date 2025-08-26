import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExecutiveBoardDto {
  @ApiProperty({
    description: 'Unit (including rank and name)',
    example: 'General Luong Tam Quang',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  unit: string;

  @ApiProperty({
    description: 'Position title',
    example: 'Chairman',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  position_title: string;

  @ApiProperty({
    description: 'Professional expertise and other positions',
    example: 'Member of Politburo, Minister of Public Security',
    required: false
  })
  @IsOptional()
  @IsString()
  professional_expertise?: string;

  @ApiProperty({
    description: 'Active status',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
