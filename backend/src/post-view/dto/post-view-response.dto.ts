import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Status } from '../../config/base-audit.entity';

export class PostViewResponseDto {
  @ApiProperty({
    description: 'Post view ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Post ID that was viewed',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Expose()
  post_id: string;

  @ApiProperty({
    description: 'View count',
    example: 1
  })
  @Expose()
  view_count: number;

  @ApiProperty({
    description: 'Date when the post was viewed', 
    example: '2023-12-01T10:00:00.000Z'
  })
  @Expose()
  view_date: Date;

  @ApiProperty({
    description: 'Status of the post view record',
    enum: Status,
    example: Status.ACTIVE
  })
  @Expose()
  status: Status;

  @ApiProperty({
    description: 'Created at timestamp',
    example: '2023-12-01T10:00:00.000Z'
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Created by user',
    example: 'system'
  })
  @Expose()
  created_by: string;

  @ApiProperty({
    description: 'Modified at timestamp',
    example: '2023-12-01T10:00:00.000Z'
  })
  @Expose()
  modified_at: Date;

  @ApiProperty({
    description: 'Modified by user',
    example: 'system'
  })
  @Expose()
  modified_by: string;
}

export class PostViewStatisticsDto {
  @ApiProperty({
    description: 'Post ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  post_id: string;

  @ApiProperty({
    description: 'Total number of views',
    example: 150
  })
  view_count: number;

  @ApiProperty({
    description: 'Total number of days with views',
    example: 5
  })
  total_days: number;

  @ApiProperty({
    description: 'Average daily views',
    example: 30.5
  })
  avg_daily_views: number;

  @ApiProperty({
    description: 'First view timestamp',
    example: '2023-12-01T10:00:00.000Z',
    nullable: true
  })
  first_view: Date | null;

  @ApiProperty({
    description: 'Latest view timestamp',
    example: '2023-12-01T15:30:00.000Z',
    nullable: true
  })
  latest_view: Date | null;
}
