import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { MediaType } from '../entity/media.entity';

export class CreateMediaDto {
  @IsString()
  file_path: string;

  @IsString()
  file_name: string;

  @IsString()
  mime_type: string;

  @IsNumber()
  file_size: number;

  @IsOptional()
  @IsEnum(MediaType)
  media_type?: MediaType;
}
