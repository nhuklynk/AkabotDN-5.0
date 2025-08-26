import { IsOptional, IsString, IsBoolean, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class SubscriptionQueryDto extends PaginationQueryDto {
  @ApiProperty({ description: 'Search by full name', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ description: 'Search by phone number', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Search by email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Sort by field', required: false, example: 'created_at', enum: ['created_at', 'modified_at', 'fullName', 'email'] })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', required: false, example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
