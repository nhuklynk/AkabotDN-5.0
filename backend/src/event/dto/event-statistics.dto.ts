import { ApiProperty } from '@nestjs/swagger';

export class EventStatisticsDto {
  @ApiProperty({
    description: 'Total number of events',
    example: 50
  })
  total_events: number;

  @ApiProperty({
    description: 'Number of active events',
    example: 45
  })
  active_events: number;

  @ApiProperty({
    description: 'Number of inactive events',
    example: 5
  })
  inactive_events: number;

  @ApiProperty({
    description: 'Events created in the last 7 days',
    example: 3
  })
  events_last_7_days: number;

  @ApiProperty({
    description: 'Events created in the last 30 days',
    example: 12
  })
  events_last_30_days: number;

  @ApiProperty({
    description: 'Upcoming events (start_time > now)',
    example: 25
  })
  upcoming_events: number;

  @ApiProperty({
    description: 'Past events (end_time < now)',
    example: 15
  })
  past_events: number;

  @ApiProperty({
    description: 'Events with countdown enabled',
    example: 30
  })
  countdown_enabled_events: number;

  @ApiProperty({
    description: 'Average events per month in current year',
    example: 4.2
  })
  avg_events_per_month: number;
}

export class MonthlyEventStatisticsDto {
  @ApiProperty({
    description: 'Year',
    example: 2024
  })
  year: number;

  @ApiProperty({
    description: 'Month (1-12)',
    example: 3
  })
  month: number;

  @ApiProperty({
    description: 'Month name',
    example: 'March'
  })
  month_name: string;

  @ApiProperty({
    description: 'Number of events created in this month',
    example: 8
  })
  event_count: number;
}

export class EventLocationStatisticsDto {
  @ApiProperty({
    description: 'Event location',
    example: 'Ho Chi Minh City'
  })
  location: string;

  @ApiProperty({
    description: 'Number of events at this location',
    example: 15
  })
  event_count: number;

  @ApiProperty({
    description: 'Percentage of total events',
    example: 30.0
  })
  percentage: number;
}

export class EventCategoryStatisticsDto {
  @ApiProperty({
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  category_id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Technology'
  })
  category_name: string;

  @ApiProperty({
    description: 'Number of events in this category',
    example: 20
  })
  event_count: number;

  @ApiProperty({
    description: 'Percentage of total active events that belong to this category. Note: Since an event can belong to multiple categories, the sum of all percentages may exceed 100%.',
    example: 40.0
  })
  percentage: number;
}

export class EventTagStatisticsDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  tag_id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'Workshop'
  })
  tag_name: string;

  @ApiProperty({
    description: 'Number of events with this tag',
    example: 12
  })
  event_count: number;

  @ApiProperty({
    description: 'Percentage of total active events that have this tag. Note: Since an event can have multiple tags, the sum of all percentages may exceed 100%.',
    example: 24.0
  })
  percentage: number;
}
