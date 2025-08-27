import { IsString, IsOptional, IsEnum, MinLength, IsArray, IsUUID } from 'class-validator';
import { Status } from 'src/config/base-audit.entity';

export class UpdateUserDto {

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  role_ids?: string[];
}
