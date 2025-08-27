import { ApiProperty } from '@nestjs/swagger';

export class MediaContentStatisticsItemDto {
  @ApiProperty({ description: 'Content type (images, videos, events)' })
  type: 'images' | 'videos' | 'events';

  @ApiProperty({ description: 'Display label for the content type' })
  label: string;

  @ApiProperty({ description: 'Number of media files for this content type' })
  count: number;

  @ApiProperty({ description: 'Formatted number string (e.g. "2,500+")' })
  formatted_count: string;
}

export class MediaContentStatisticsDto {
  @ApiProperty({ 
    description: 'Content statistics grouped by type',
    type: [MediaContentStatisticsItemDto]
  })
  statistics: MediaContentStatisticsItemDto[];
}
