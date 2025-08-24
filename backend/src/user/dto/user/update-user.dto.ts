import { IsString, IsOptional, IsEnum, MinLength, IsArray, IsUUID } from 'class-validator';
import { UserStatus } from '../../entity/user.entity';

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
  @IsEnum(UserStatus)
  user_status?: UserStatus;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  role_ids?: string[];
}
