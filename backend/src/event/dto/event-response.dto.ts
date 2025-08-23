import { Expose, Type } from 'class-transformer';

export class EventResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  location: string;

  @Expose()
  start_time: Date;

  @Expose()
  end_time: Date;

  @Expose()
  thumbnailUrlId: string;

  @Expose()
  countdownEnabled: boolean;

  @Expose()
  public_status: string;

  @Expose()
  eventCategoryId: string;

  @Expose()
  created_at: Date;

  @Expose()
  modified_at: Date;

  @Expose()
  @Type(() => Object)
  eventCategory?: any;

  @Expose()
  @Type(() => Object)
  eventMedia?: any[];

  constructor(partial: Partial<EventResponseDto>) {
    Object.assign(this, partial);
  }
}
