import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { MediaType } from '../entity/media.entity';

export class UpdateMediaDto {
  @IsOptional()
  @IsString()
  file_path?: string;

  @IsOptional()
  @IsString()
  file_name?: string;

  @IsOptional()
  @IsString()
  mime_type?: string;

  @IsOptional()
  @IsNumber()
  file_size?: number;

  @IsOptional()
  @IsEnum(MediaType)
  media_type?: MediaType;
}
