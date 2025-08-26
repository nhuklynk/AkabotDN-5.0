import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from './entity/event.entity';
import { Tag } from '../tag/entity/tag.entity';
import { Category } from '../category/entity/category.entity';
import { CreateEventFormdataDto } from './dto/create-event.dto';
import { UpdateEventFormdataDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { Status } from '../config/base-audit.entity';
import { plainToClass } from 'class-transformer';
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storageService: StorageService,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    createEventDto: CreateEventFormdataDto,
    thumbnailFile?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    const existingEvent = await this.eventRepository.findOne({
      where: { slug: createEventDto.slug },
    });
  
    if (existingEvent) {
      throw new BadRequestException(
        `Event with slug '${createEventDto.slug}' already exists`,
      );
    }

    const categoryIds = createEventDto.category_ids
      ? this.normalizeIds(createEventDto.category_ids)
      : [];
    const tagIds = createEventDto.tag_ids
      ? this.normalizeIds(createEventDto.tag_ids)
      : [];
  
    const countdownEnabled =
      typeof createEventDto.countdown_enabled === 'string'
        ? createEventDto.countdown_enabled === 'true'
        : Boolean(createEventDto.countdown_enabled);
  
    let thumbnailUrlId: string | undefined = undefined;
    if (thumbnailFile) {
      thumbnailUrlId = await this.handleThumbnailUpload(thumbnailFile);
    }
  
    const event = this.eventRepository.create({
      title: createEventDto.title,
      slug: createEventDto.slug,
      description: createEventDto.description,
      location: createEventDto.location,
      start_time: new Date(createEventDto.start_time),
      end_time: createEventDto.end_time
        ? new Date(createEventDto.end_time)
        : undefined,
      countdown_enabled: countdownEnabled,
      thumbnail_url_id: thumbnailUrlId,
    });
  
    if (categoryIds.length) {
      event.categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
    }
    if (tagIds.length) {
      event.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }
  
    const savedEvent = await this.eventRepository.save(event);
  
    return plainToClass(EventResponseDto, savedEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
  
  private normalizeIds(ids?: string): string[] {
    if (!ids) return [];
    return ids.split(',').map((id) => id.trim()).filter((id) => id);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventFormdataDto,
    thumbnailFile?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id, status: Status.ACTIVE },
      relations: ['tags', 'categories'],
    });
  
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  
    let thumbnailUrlId = event.thumbnail_url_id; 
    if (thumbnailFile) {
      thumbnailUrlId =
        (await this.handleThumbnailUpload(thumbnailFile)) ??
        event.thumbnail_url_id;
    } else if (updateEventDto.thumbnail !== undefined) {
      thumbnailUrlId = updateEventDto.thumbnail || event.thumbnail_url_id;
    }
  
    if (updateEventDto.tag_ids !== undefined && updateEventDto.tag_ids !== null) {
      const tagIds = this.normalizeIds(updateEventDto.tag_ids);
      
      if (tagIds.length > 0) {
        const foundTags = await this.tagRepository.findBy({ 
          id: In(tagIds),
          status: Status.ACTIVE 
        });
        event.tags = foundTags;
      }
    }
  
    if (updateEventDto.category_ids !== undefined && updateEventDto.category_ids !== null) {
      const categoryIds = this.normalizeIds(updateEventDto.category_ids);
      
      if (categoryIds.length > 0) {
        const foundCategories = await this.categoryRepository.findBy({ 
          id: In(categoryIds),
          status: Status.ACTIVE 
        });
        event.categories = foundCategories;
      }
    }
  
    Object.assign(event, {
      ...updateEventDto,
      start_time: updateEventDto.start_time
        ? new Date(updateEventDto.start_time)
        : event.start_time,
      end_time: updateEventDto.end_time
        ? new Date(updateEventDto.end_time)
        : event.end_time,
      countdown_enabled:
        updateEventDto.countdown_enabled !== undefined
          ? updateEventDto.countdown_enabled === 'true' ||
            updateEventDto.countdown_enabled === '1'
          : event.countdown_enabled,
      thumbnail_url_id: thumbnailUrlId,
    });
  
    const updatedEvent = await this.eventRepository.save(event);
  
    return plainToClass(EventResponseDto, updatedEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }  
  
  private async handleThumbnailUpload(
    file: Express.Multer.File,
  ): Promise<string | undefined> {
    try {
      const uploadResult = await this.storageService.uploadFile({
        file: file.buffer,
        fileName: file.originalname,
        contentType: file.mimetype,
        fileSize: file.size,
        bucket: 'events',
        scope: 'thumbnails',
      });
  
      const mediaRecord = await this.mediaService.create({
        file_name: file.originalname,
        file_path: uploadResult,
        file_size: file.size,
        mime_type: file.mimetype,
        media_type: MediaType.EVENT,
      });
  
      return mediaRecord.id;
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      return undefined;
    }
  }

  async findAll(queryDto: EventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      title, 
      location, 
      status, 
      start_date, 
      end_date,
      tag_id,
      category_id,
      countdown_enabled 
    } = queryDto;
    
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tags', 'tag')
      .leftJoinAndSelect('event.categories', 'category')
      .where('event.status = :status', { status: Status.ACTIVE });
  
    if (title) {
      queryBuilder.andWhere('LOWER(event.title) LIKE LOWER(:title)', { title: `%${title}%` });
    }
  
    if (location) {
      queryBuilder.andWhere('LOWER(event.location) LIKE LOWER(:location)', { location: `%${location}%` });
    }
  
    if (status) {
      queryBuilder.andWhere('event.status = :status', { status });
    }
  
    if (start_date && end_date) {
      queryBuilder.andWhere('event.start_time BETWEEN :start_date AND :end_date', {
        start_date,
        end_date,
      });
    } else if (start_date) {
      queryBuilder.andWhere('event.start_time >= :start_date', { start_date });
    } else if (end_date) {
      queryBuilder.andWhere('event.start_time <= :end_date', { end_date });
    }
  
    if (tag_id) {
      queryBuilder.andWhere('tag.id = :tag_id', { tag_id });
    }
  
    if (category_id) {
      queryBuilder.andWhere('category.id = :category_id', { category_id });
    }
  
    if (countdown_enabled !== undefined) {
      queryBuilder.andWhere('event.countdown_enabled = :countdown_enabled', { countdown_enabled });
    }
  
    queryBuilder
      .orderBy('event.start_time', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    return {
      items: items.map(item => plainToClass(EventResponseDto, item, { 
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }  

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id, status: Status.ACTIVE },
      relations: ['tags', 'categories'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return plainToClass(EventResponseDto, event, { 
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }


  async remove(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (event) {
      event.status = Status.INACTIVE;
      await this.eventRepository.save(event);
    }
  }
}
