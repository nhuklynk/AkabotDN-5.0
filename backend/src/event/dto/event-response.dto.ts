import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../config/base-audit.entity';
import { EventStatus } from '../entity/event.entity';

export class EventResponseDto {
  @ApiProperty({
    description: 'Event ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Event title',
    example: 'AI Conference 2024'
  })
  title: string;

  @ApiProperty({
    description: 'Event slug',
    example: 'ai-conference-2024'
  })
  slug: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Join us for the biggest AI conference of the year',
    nullable: true
  })
  description: string | null;

  @ApiProperty({
    description: 'Event location',
    example: 'Hanoi Convention Center',
    nullable: true
  })
  location: string | null;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-12-01T09:00:00.000Z'
  })
  start_time: Date;

  @ApiProperty({
    description: 'Event end time',
    example: '2024-12-01T17:00:00.000Z',
    nullable: true
  })
  end_time: Date | null;

  @ApiProperty({
    description: 'Thumbnail URL ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true
  })
  thumbnail_url_id: string | null;

  @ApiProperty({
    description: 'Whether countdown is enabled',
    example: true
  })
  countdown_enabled: boolean;

  @ApiProperty({
    description: 'Event publication status',
    enum: EventStatus,
    example: EventStatus.PUBLISHED
  })
  public_status: EventStatus;

  @ApiProperty({
    description: 'Tags associated with the event',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      }
    }
  })
  tags: Array<{ id: string; name: string }>;

  @ApiProperty({
    description: 'Categories associated with the event',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      }
    }
  })
  categories: Array<{ id: string; name: string }>;

  @ApiProperty({
    description: 'Entity status',
    enum: Status,
    example: Status.ACTIVE
  })
  status: Status;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2024-12-01T10:00:00.000Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Created by user',
    example: 'system'
  })
  created_by: string;

  @ApiProperty({
    description: 'Modified at timestamp',
    example: '2024-12-01T10:00:00.000Z'
  })
  modified_at: Date;

  @ApiProperty({
    description: 'Modified by user',
    example: 'system'
  })
  modified_by: string;
}
