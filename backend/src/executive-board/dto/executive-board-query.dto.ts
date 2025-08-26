import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum PositionTitle {
  CHAIRMAN = 'Chairman',
  STANDING_VICE_CHAIRMAN = 'Standing Vice Chairman',
  EXECUTIVE_VICE_CHAIRMAN = 'Executive Vice Chairman',
  MEMBER = 'Member'
}

export class ExecutiveBoardQueryDto {
  @ApiProperty({
    description: 'Search by unit or other information',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by position title',
    enum: PositionTitle,
    required: false
  })
  @IsOptional()
  @IsEnum(PositionTitle)
  position_title?: PositionTitle;

  @ApiProperty({
    description: 'Filter by active status',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;

}
