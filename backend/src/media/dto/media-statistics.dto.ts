import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../entity/media.entity';

export class MediaStatisticsItemDto {
  @ApiProperty({ description: 'Media type', enum: MediaType })
  media_type: MediaType;

  @ApiProperty({ description: 'Number of media files for this type' })
  count: number;
}

export class MediaStatisticsDto {
  @ApiProperty({ 
    description: 'Statistics for each media type',
    type: [MediaStatisticsItemDto]
  })
  statistics: MediaStatisticsItemDto[];

  @ApiProperty({ description: 'Total number of media files' })
  total: number;
}
