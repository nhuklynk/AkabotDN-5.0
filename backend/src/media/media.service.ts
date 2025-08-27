import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entity/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/config/base-audit.entity';
import { MediaQueryDto } from './dto/media-query.dto';
import { PaginatedData } from 'src/common/interfaces/api-response.interface';
import { StorageService } from 'src/storage';
import * as path from 'path';
import { CreateMediaFormDataDto } from './dto/create-media-formdata.dto';
import { UpdateMediaFormDataDto } from './dto/update-media-formdata.dto';
import { MediaByTypeQueryDto } from './dto/media-by-type-query.dto';
import { MediaStatisticsDto, MediaStatisticsItemDto } from './dto/media-statistics.dto';
import { MediaContentStatisticsDto, MediaContentStatisticsItemDto } from './dto/media-content-statistics.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private storageService: StorageService,
  ) {}

  async findAll(
    query: MediaQueryDto,
  ): Promise<PaginatedData<MediaResponseDto>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .orderBy('media.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    // Search ignoring case
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(media.file_name) LIKE LOWER(:search) OR LOWER(media.mime_type) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items: await this.mapMediaToResponseDtos(items),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return await this.mapMediaToResponseDto(media);
  }

  async findByType(
    media_type: MediaType,
    query?: MediaByTypeQueryDto,
  ): Promise<PaginatedData<MediaResponseDto>> {
    const { page = 1, limit = 10 } = query || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.media_type = :media_type', { media_type })
      .orderBy('media.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items: await this.mapMediaToResponseDtos(items),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async create(createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    const media = this.mediaRepository.create({
      ...createMediaDto,
    });

    const savedMedia = await this.mediaRepository.save(media);
    return await this.mapMediaToResponseDto(savedMedia);
  }

  async createFromFormData(
    file: Express.Multer.File,
    createMediaFormDataDto: CreateMediaFormDataDto,
  ): Promise<MediaResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'text/plain',
      'text/csv',
      'application/csv',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`File type "${file.mimetype}" not allowed`);
    }

    try {
      const uploadResult = await this.storageService.uploadFile({
        file: file.buffer,
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
        scope: 'uploads',
      });

      const media = this.mediaRepository.create({
        file_name: file.originalname,
        file_path: uploadResult,
        mime_type: file.mimetype,
        file_size: file.size,
        media_type: createMediaFormDataDto.media_type,
      });

      const savedMedia = await this.mediaRepository.save(media);
      return await this.mapMediaToResponseDto(savedMedia);
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async updateFromFormData(
    id: string,
    file: Express.Multer.File | undefined,
    updateMediaFormDataDto: UpdateMediaFormDataDto,
  ): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    let updateData: Partial<Media> = {};

    if (file) {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'audio/mpeg',
        'text/plain',
        'text/csv',
        'application/csv',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File type "${file.mimetype}" not allowed`,
        );
      }

      try {
        const uploadResult = await this.storageService.uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          scope: 'uploads',
        });

        updateData = {
          file_name: file.originalname,
          file_path: uploadResult,
          mime_type: file.mimetype,
          file_size: file.size,
        };
      } catch (error) {
        throw new BadRequestException(
          `Failed to upload file: ${error.message}`,
        );
      }
    }

    if (updateMediaFormDataDto.media_type !== undefined) {
      updateData.media_type = updateMediaFormDataDto.media_type;
    }

    await this.mediaRepository.update(id, updateData);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });
    await this.mediaRepository.delete(id);
    if (media) {
      await this.storageService.deleteSingleFile(media.file_path);
    }
  }

  async download(id: string) {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return this.storageService.getDownloadUrlWithFilename(media.file_path);
  }

  /**
   * Get media URL from file path using storage service
   */
  private async getMediaUrl(filePath?: string): Promise<string | undefined> {
    if (!filePath || filePath.trim() === '') {
      return undefined;
    }
    
    try {
      return await this.storageService.getFileUrl(filePath);
    } catch (error) {
      console.error('Error getting media URL for filePath:', filePath, error);
      return undefined;
    }
  }

  /**
   * Map single media to response DTO with media URL
   */
  private async mapMediaToResponseDto(media: any): Promise<MediaResponseDto> {
    const mediaDto = plainToClass(MediaResponseDto, media, { 
      excludeExtraneousValues: true 
    });
    
    // Get media URL from file_path
    if (media.file_path && media.file_path.trim() !== '') {
      mediaDto.media_url = await this.getMediaUrl(media.file_path);
    }
    
    return mediaDto;
  }

  /**
   * Map media array to response DTOs with media URLs
   */
  private async mapMediaToResponseDtos(medias: any[]): Promise<MediaResponseDto[]> {
    const mediaDtos: MediaResponseDto[] = [];
    
    for (const media of medias) {
      const mediaDto = await this.mapMediaToResponseDto(media);
      mediaDtos.push(mediaDto);
    }
    
    return mediaDtos;
  }

  /**
   * Get statistics of media count by type
   */
  async getStatistics(): Promise<MediaStatisticsDto> {
    // Get actual counts from database
    const statistics = await this.mediaRepository
      .createQueryBuilder('media')
      .select('media.media_type', 'media_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('media.media_type')
      .getRawMany();

    // Create a map of actual counts
    const countsMap = new Map<MediaType, number>();
    statistics.forEach(stat => {
      countsMap.set(stat.media_type, parseInt(stat.count));
    });

    // Initialize all media types with count 0, then update with actual counts
    const allMediaTypes = Object.values(MediaType);
    const statisticsItems: MediaStatisticsItemDto[] = allMediaTypes.map(mediaType => ({
      media_type: mediaType,
      count: countsMap.get(mediaType) || 0,
    }));

    const total = statisticsItems.reduce((sum, item) => sum + item.count, 0);

    return {
      statistics: statisticsItems,
      total,
    };
  }

  /**
   * Get content statistics grouped by media content type (images, videos, events)
   */
  async getContentStatistics(): Promise<MediaContentStatisticsDto> {
    try {
      // Count images (by mime type)
      const imageCount = await this.mediaRepository
        .createQueryBuilder('media')
        .where('media.mime_type LIKE :imageType', { imageType: 'image/%' })
        .getCount();

      // Count videos (by mime type)
      const videoCount = await this.mediaRepository
        .createQueryBuilder('media')
        .where('media.mime_type LIKE :videoType', { videoType: 'video/%' })
        .getCount();

      // Count events (by media type)
      const eventCount = await this.mediaRepository
        .createQueryBuilder('media')
        .where('media.media_type = :eventType', { eventType: MediaType.EVENT })
        .getCount();

      // Helper function to format numbers
      const formatCount = (count: number): string => {
        if (count >= 1000) {
          const thousands = Math.floor(count / 1000);
          const remainder = count % 1000;
          if (remainder === 0) {
            return `${thousands.toLocaleString()}k`;
          } else {
            return `${thousands.toLocaleString()},${remainder.toString().padStart(3, '0').slice(0, 1)}00+`;
          }
        }
        return count.toString();
      };

      const statistics: MediaContentStatisticsItemDto[] = [
        {
          type: 'images' as 'images',
          label: 'header.dropdown.products.documents.page.statistics.images',
          count: imageCount,
          formatted_count: formatCount(imageCount),
        },
        {
          type: 'videos' as 'videos',
          label: 'header.dropdown.products.documents.page.statistics.videos', 
          count: videoCount,
          formatted_count: formatCount(videoCount),
        },
        {
          type: 'events' as 'events',
          label: 'header.dropdown.products.documents.page.statistics.events',
          count: eventCount,
          formatted_count: formatCount(eventCount),
        },
      ];

      console.log('Media content statistics:', {
        imageCount,
        videoCount, 
        eventCount,
        statistics
      });

      return {
        statistics,
      };
    } catch (error) {
      console.error('Error in getContentStatistics:', error);
      throw new BadRequestException(`Failed to fetch content statistics: ${error.message}`);
    }
  }
}
