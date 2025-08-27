import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '../entity/media.entity';

export class UpdateMediaFormDataDto {
  @ApiPropertyOptional({
    description: 'Media type classification',
    enum: MediaType,
  })
  @IsOptional()
  @IsEnum(MediaType)
  media_type?: MediaType;
}
