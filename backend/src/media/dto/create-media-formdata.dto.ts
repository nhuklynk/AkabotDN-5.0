import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entity/media.entity';

export class CreateMediaFormDataDto {
  @ApiProperty({
    description: 'Media type classification',
    enum: MediaType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MediaType)
  media_type?: MediaType;
}
