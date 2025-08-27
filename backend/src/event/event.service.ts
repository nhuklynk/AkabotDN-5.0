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
import { EventQueryDto, TagEventQueryDto, CategoryEventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { Status } from '../config/base-audit.entity';
import { plainToClass } from 'class-transformer';
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';
import { MoreThanOrEqual, LessThan } from 'typeorm';
import {
  EventStatisticsDto,
  MonthlyEventStatisticsDto,
  EventLocationStatisticsDto,
  EventCategoryStatisticsDto,
  EventTagStatisticsDto
} from './dto/event-statistics.dto';

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
  
    return await this.mapEventToResponseDto(savedEvent);
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
  
    return await this.mapEventToResponseDto(updatedEvent);
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
      items: await this.mapEventsToResponseDtos(items),
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

    return await this.mapEventToResponseDto(event);
  }

  async findByTagId(tagId: string, queryDto?: TagEventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    const { 
      page = 1, 
      limit = 10,  
      start_date, 
      end_date 
    } = queryDto || {};
    
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tags', 'tag')
      .leftJoinAndSelect('event.categories', 'category')
      .where('event.status = :status', { status: Status.ACTIVE })
      .andWhere('tag.id = :tagId', { tagId });
  
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
  
    queryBuilder
      .orderBy('event.start_time', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    return {
      items: await this.mapEventsToResponseDtos(items),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findByCategoryId(categoryId: string, queryDto?: CategoryEventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      start_date, 
      end_date 
    } = queryDto || {};
    
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.tags', 'tag')
      .leftJoinAndSelect('event.categories', 'category')
      .where('event.status = :status', { status: Status.ACTIVE })
      .andWhere('category.id = :categoryId', { categoryId });
  
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
  
    queryBuilder
      .orderBy('event.start_time', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    return {
      items: await this.mapEventsToResponseDtos(items),
      total,
      page,
      limit,
      totalPages,
    };
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

  async getEventStatistics(): Promise<EventStatisticsDto> {
    const totalEvents = await this.eventRepository.count();
    
    const activeEvents = await this.eventRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    const inactiveEvents = await this.eventRepository.count({
      where: { status: Status.INACTIVE }
    });

    // Events in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const eventsLast7Days = await this.eventRepository.count({
      where: {
        created_at: MoreThanOrEqual(sevenDaysAgo)
      }
    });

    // Events in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const eventsLast30Days = await this.eventRepository.count({
      where: {
        created_at: MoreThanOrEqual(thirtyDaysAgo)
      }
    });

    // Upcoming events (start_time > now)
    const now = new Date();
    const upcomingEvents = await this.eventRepository.count({
      where: {
        start_time: MoreThanOrEqual(now),
        status: Status.ACTIVE
      }
    });

    // Past events (end_time < now)
    const pastEvents = await this.eventRepository.count({
      where: {
        end_time: LessThan(now),
        status: Status.ACTIVE
      }
    });

    // Events with countdown enabled
    const countdownEnabledEvents = await this.eventRepository.count({
      where: {
        countdown_enabled: true,
        status: Status.ACTIVE
      }
    });

    // Average events per month in current year
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const eventsThisYear = await this.eventRepository.count({
      where: {
        created_at: MoreThanOrEqual(yearStart)
      }
    });
    const currentMonth = new Date().getMonth() + 1;
    const avgEventsPerMonth = currentMonth > 0 ? eventsThisYear / currentMonth : 0;

    return {
      total_events: totalEvents,
      active_events: activeEvents,
      inactive_events: inactiveEvents,
      events_last_7_days: eventsLast7Days,
      events_last_30_days: eventsLast30Days,
      upcoming_events: upcomingEvents,
      past_events: pastEvents,
      countdown_enabled_events: countdownEnabledEvents,
      avg_events_per_month: Math.round(avgEventsPerMonth * 100) / 100
    };
  }

  async getMonthlyEventStatistics(year?: number): Promise<MonthlyEventStatisticsDto[]> {
    const currentYear = year || new Date().getFullYear();
    
    const monthlyStats = await this.eventRepository
      .createQueryBuilder('event')
      .select('EXTRACT(MONTH FROM event.created_at)', 'month')
      .addSelect('COUNT(*)', 'event_count')
      .where('EXTRACT(YEAR FROM event.created_at) = :year', { year: currentYear })
      .groupBy('EXTRACT(MONTH FROM event.created_at)')
      .orderBy('EXTRACT(MONTH FROM event.created_at)', 'ASC')
      .getRawMany();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const result: MonthlyEventStatisticsDto[] = [];
    for (let month = 1; month <= 12; month++) {
      const stat = monthlyStats.find(s => parseInt(s.month) === month);
      result.push({
        year: currentYear,
        month: month,
        month_name: monthNames[month - 1],
        event_count: stat ? parseInt(stat.event_count) : 0
      });
    }

    return result;
  }

  async getEventLocationStatistics(limit: number = 10): Promise<EventLocationStatisticsDto[]> {
    const totalEvents = await this.eventRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    const locationStats = await this.eventRepository
      .createQueryBuilder('event')
      .select('event.location', 'location')
      .addSelect('COUNT(*)', 'event_count')
      .where('event.status = :status', { status: Status.ACTIVE })
      .andWhere('event.location IS NOT NULL')
      .groupBy('event.location')
      .orderBy('COUNT(*)', 'DESC')
      .limit(limit)
      .getRawMany();

    return locationStats.map(stat => ({
      location: stat.location,
      event_count: parseInt(stat.event_count),
      percentage: totalEvents > 0 ? Math.round((parseInt(stat.event_count) / totalEvents) * 10000) / 100 : 0
    }));
  }

  async getEventCategoryStatistics(limit: number = 10): Promise<EventCategoryStatisticsDto[]> {
    // Get total active events
    const totalEvents = await this.eventRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    // Get category statistics with distinct event count per category
    const categoryStats = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.categories', 'category')
      .select('category.id', 'category_id')
      .addSelect('category.name', 'category_name')
      .addSelect('COUNT(DISTINCT event.id)', 'event_count')
      .where('event.status = :status', { status: Status.ACTIVE })
      .andWhere('category.id IS NOT NULL')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('COUNT(DISTINCT event.id)', 'DESC')
      .limit(limit)
      .getRawMany();

    return categoryStats.map(stat => {
      const eventCount = parseInt(stat.event_count);
      const percentage = totalEvents > 0 ? Math.round((eventCount / totalEvents) * 10000) / 100 : 0;
      
      return {
        category_id: stat.category_id,
        category_name: stat.category_name,
        event_count: eventCount,
        percentage: percentage
      };
    });
  }

  async getEventTagStatistics(limit: number = 10): Promise<EventTagStatisticsDto[]> {
    // Get total active events
    const totalEvents = await this.eventRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    // Get tag statistics with distinct event count per tag
    const tagStats = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.tags', 'tag')
      .select('tag.id', 'tag_id')
      .addSelect('tag.name', 'tag_name')
      .addSelect('COUNT(DISTINCT event.id)', 'event_count')
      .where('event.status = :status', { status: Status.ACTIVE })
      .andWhere('tag.id IS NOT NULL')
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .orderBy('COUNT(DISTINCT event.id)', 'DESC')
      .limit(limit)
      .getRawMany();

    return tagStats.map(stat => {
      const eventCount = parseInt(stat.event_count);
      const percentage = totalEvents > 0 ? Math.round((eventCount / totalEvents) * 10000) / 100 : 0;
      
      return {
        tag_id: stat.tag_id,
        tag_name: stat.tag_name,
        event_count: eventCount,
        percentage: percentage
      };
    });
  }

  /**
   * Get media URL from media ID using storage service
   */
  private async getMediaUrl(mediaId?: string): Promise<string | undefined> {
    if (!mediaId || mediaId.trim() === '') {
      return undefined;
    }
    
    try {
      return await this.storageService.getFileUrl(mediaId);
    } catch (error) {
      console.error('Error getting media URL for mediaId:', mediaId, error);
      return undefined;
    }
  }

  /**
   * Map single event to response DTO with thumbnail URL
   */
  private async mapEventToResponseDto(event: any): Promise<EventResponseDto> {
    const eventDto = plainToClass(EventResponseDto, event, { 
      excludeExtraneousValues: true 
    });
    
    // Get thumbnail URL if thumbnail_url_id is valid
    if (event.thumbnail_url_id && event.thumbnail_url_id.trim() !== '') {
      eventDto.thumbnail_url = await this.getMediaUrl(event.thumbnail_url_id);
    }
    
    return eventDto;
  }

  /**
   * Map events to response DTOs with thumbnail URLs
   */
  private async mapEventsToResponseDtos(events: any[]): Promise<EventResponseDto[]> {
    const eventDtos: EventResponseDto[] = [];
    
    for (const event of events) {
      const eventDto = await this.mapEventToResponseDto(event);
      eventDtos.push(eventDto);
    }
    
    return eventDtos;
  }
}
