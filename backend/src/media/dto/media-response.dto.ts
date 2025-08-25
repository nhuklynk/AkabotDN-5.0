import { Expose, Type } from 'class-transformer';
import { MediaType } from '../entity/media.entity';

export class MediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  file_name: string;

  @Expose()
  file_path: string;

  @Expose()
  mime_type: string;

  @Expose()
  file_size: number;

  @Expose()
  media_type: MediaType;

  @Expose()
  created_at: Date;

  constructor(partial: Partial<MediaResponseDto>) {
    Object.assign(this, partial);
  }
}
