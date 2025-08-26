import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private storageService: StorageService,
  ) {}

  async findAll(query: MediaQueryDto): Promise<PaginatedData<MediaResponseDto>> {
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
      items: items.map(m => plainToClass(MediaResponseDto, m, { excludeExtraneousValues: true })),
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

    return plainToClass(MediaResponseDto, media, { excludeExtraneousValues: true });
  }

  async findByType(media_type: MediaType): Promise<MediaResponseDto[]> {
    const media = await this.mediaRepository.find({
      where: { media_type: media_type },
    });
    return media.map(media => plainToClass(MediaResponseDto, media, { excludeExtraneousValues: true }));
  }


  async create(createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    const media = this.mediaRepository.create({
      ...createMediaDto
    });

    const savedMedia = await this.mediaRepository.save(media);
    return plainToClass(MediaResponseDto, savedMedia, { excludeExtraneousValues: true });
  }

  async createFromFormData(
    file: Express.Multer.File,
    createMediaFormDataDto: CreateMediaFormDataDto
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
        bucket: 'media',
        scope: 'uploads',
      });

      const media = this.mediaRepository.create({
        file_name: file.originalname,
        file_path: uploadResult || file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        media_type: createMediaFormDataDto.media_type,
      });
  
      const savedMedia = await this.mediaRepository.save(media);
      return plainToClass(MediaResponseDto, savedMedia, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }  

  async updateFromFormData(
    id: string,
    file: Express.Multer.File | undefined,
    updateMediaFormDataDto: UpdateMediaFormDataDto
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
        throw new BadRequestException(`File type "${file.mimetype}" not allowed`);
      }

      try {
        const uploadResult = await this.storageService.uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          bucket: 'media',
          scope: 'uploads',
        });

        updateData = {
          file_name: file.originalname,
          file_path: uploadResult,
          mime_type: file.mimetype,
          file_size: file.size,
        };
      } catch (error) {
        throw new BadRequestException(`Failed to upload file: ${error.message}`);
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

    if (media) {
      media.status = Status.INACTIVE;
      await this.mediaRepository.save(media);
    }
  }

  async download(id: string) {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return this.storageService.getDownloadUrl(media.file_path);
  }
}
