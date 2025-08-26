import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../entity/post.entity';
import { Status } from '../../config/base-audit.entity';

export class PostStatisticsDto {
  @ApiProperty({
    description: 'Total number of posts',
    example: 150
  })
  total_posts: number;

  @ApiProperty({
    description: 'Number of active posts',
    example: 120
  })
  active_posts: number;

  @ApiProperty({
    description: 'Number of inactive posts',
    example: 20
  })
  inactive_posts: number;

  @ApiProperty({
    description: 'Number of published posts',
    example: 100
  })
  published_posts: number;

  @ApiProperty({
    description: 'Posts created in the last 7 days',
    example: 15
  })
  posts_last_7_days: number;

  @ApiProperty({
    description: 'Posts created in the last 30 days',
    example: 45
  })
  posts_last_30_days: number;

  @ApiProperty({
    description: 'Average posts per day in the last 30 days',
    example: 1.5
  })
  avg_posts_per_day: number;
}

export class PostTypeStatisticsDto {
  @ApiProperty({
    description: 'Post type',
    enum: PostType,
    example: PostType.MEMBER_ACTIVITY
  })
  post_type: PostType;

  @ApiProperty({
    description: 'Number of posts for this type',
    example: 25
  })
  count: number;

  @ApiProperty({
    description: 'Percentage of total posts',
    example: 16.67
  })
  percentage: number;
}

export class PostTypeStatisticsResponseDto {
  @ApiProperty({
    description: 'Total number of posts across all types',
    example: 150
  })
  total_posts: number;

  @ApiProperty({
    description: 'Statistics by post type',
    type: [PostTypeStatisticsDto]
  })
  by_type: PostTypeStatisticsDto[];
}

export class PostAuthorStatisticsDto {
  @ApiProperty({
    description: 'Author ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  author_id: string;

  @ApiProperty({
    description: 'Author name',
    example: 'John Doe'
  })
  author_name: string;

  @ApiProperty({
    description: 'Number of posts by this author',
    example: 15
  })
  post_count: number;

  @ApiProperty({
    description: 'Percentage of total posts',
    example: 10.0
  })
  percentage: number;
}

export class MonthlyPostStatisticsDto {
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
    description: 'Number of posts created in this month',
    example: 25
  })
  post_count: number;
}

export class PostTypeDetailedStatisticsDto {
  @ApiProperty({
    description: 'Post type being analyzed',
    enum: PostType,
    example: PostType.MEMBER_ACTIVITY
  })
  post_type: PostType;

  @ApiProperty({
    description: 'Total posts of this type',
    example: 75
  })
  total_posts: number;

  @ApiProperty({
    description: 'Active posts of this type',
    example: 65
  })
  active_posts: number;

  @ApiProperty({
    description: 'Published posts of this type',
    example: 60
  })
  published_posts: number;

  @ApiProperty({
    description: 'Posts of this type created in last 7 days',
    example: 5
  })
  posts_last_7_days: number;

  @ApiProperty({
    description: 'Posts of this type created in last 30 days',
    example: 20
  })
  posts_last_30_days: number;

  @ApiProperty({
    description: 'Percentage of all posts',
    example: 50.0
  })
  percentage_of_total: number;

  @ApiProperty({
    description: 'Monthly breakdown for current year',
    type: [MonthlyPostStatisticsDto]
  })
  monthly_breakdown: MonthlyPostStatisticsDto[];
}
