import { Expose, Type } from 'class-transformer';

export class EventMediaResponseDto {
  @Expose()
  id: string;

  @Expose()
  eventId: string;

  @Expose()
  attachFileId: string;

  @Expose()
  status: string;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  @Type(() => Object)
  event?: any;

  constructor(partial: Partial<EventMediaResponseDto>) {
    Object.assign(this, partial);
  }
}
