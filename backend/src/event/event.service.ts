import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual, In } from 'typeorm';
import { Event } from './entity/event.entity';
import { Tag } from '../tag/entity/tag.entity';
import { Category } from '../category/entity/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { Status } from '../config/base-audit.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    // Check if slug already exists
    const existingEvent = await this.eventRepository.findOne({
      where: { slug: createEventDto.slug }
    });

    if (existingEvent) {
      throw new BadRequestException(`Event with slug '${createEventDto.slug}' already exists`);
    }

    // Create event instance
    const event = this.eventRepository.create({
      title: createEventDto.title,
      slug: createEventDto.slug,
      description: createEventDto.description,
      location: createEventDto.location,
      start_time: createEventDto.start_time,
      end_time: createEventDto.end_time,
      thumbnail_url_id: createEventDto.thumbnail_url_id,
      countdown_enabled: createEventDto.countdown_enabled || false,
      public_status: createEventDto.public_status,
      status: Status.ACTIVE,
    });

    // Handle tags
    if (createEventDto.tag_ids && createEventDto.tag_ids.length > 0) {
      const tags = await this.tagRepository.findBy({ 
        id: In(createEventDto.tag_ids),
        status: Status.ACTIVE 
      });
      event.tags = tags;
    }

    // Handle categories
    if (createEventDto.category_ids && createEventDto.category_ids.length > 0) {
      const categories = await this.categoryRepository.findBy({ 
        id: In(createEventDto.category_ids),
        status: Status.ACTIVE 
      });
      event.categories = categories;
    }

    const savedEvent = await this.eventRepository.save(event);
    return this.findOne(savedEvent.id);
  }

  async findAll(queryDto: EventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      title, 
      location, 
      public_status, 
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

    // Apply filters
    if (title) {
      queryBuilder.andWhere('event.title ILIKE :title', { title: `%${title}%` });
    }

    if (location) {
      queryBuilder.andWhere('event.location ILIKE :location', { location: `%${location}%` });
    }

    if (public_status) {
      queryBuilder.andWhere('event.public_status = :public_status', { public_status });
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

    // Add pagination and ordering
    queryBuilder
      .orderBy('event.start_time', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(item => this.mapToResponseDto(item)),
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

    return this.mapToResponseDto(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id, status: Status.ACTIVE },
      relations: ['tags', 'categories'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Check if slug is being updated and already exists
    if (updateEventDto.slug && updateEventDto.slug !== event.slug) {
      const existingEvent = await this.eventRepository.findOne({
        where: { slug: updateEventDto.slug }
      });

      if (existingEvent && existingEvent.id !== id) {
        throw new BadRequestException(`Event with slug '${updateEventDto.slug}' already exists`);
      }
    }

    // Handle tags
    if (updateEventDto.tag_ids !== undefined) {
      if (updateEventDto.tag_ids.length > 0) {
        const tags = await this.tagRepository.findBy({ 
          id: In(updateEventDto.tag_ids),
          status: Status.ACTIVE 
        });
        event.tags = tags;
      } else {
        event.tags = [];
      }
    }

    // Handle categories
    if (updateEventDto.category_ids !== undefined) {
      if (updateEventDto.category_ids.length > 0) {
        const categories = await this.categoryRepository.findBy({ 
          id: In(updateEventDto.category_ids),
          status: Status.ACTIVE 
        });
        event.categories = categories;
      } else {
        event.categories = [];
      }
    }

    // Extract only fields that exist in Event entity for update
    const { tag_ids, category_ids, ...eventUpdateData } = updateEventDto;
    
    // Update the event with only valid entity fields
    await this.eventRepository.update(id, eventUpdateData);
    
    // Save the event with updated relations
    await this.eventRepository.save(event);
    
    return this.findOne(id);
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

  private mapToResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description,
      location: event.location,
      start_time: event.start_time,
      end_time: event.end_time,
      thumbnail_url_id: event.thumbnail_url_id,
      countdown_enabled: event.countdown_enabled,
      public_status: event.public_status,
      tags: event.tags ? event.tags.map(tag => ({ id: tag.id, name: tag.name })) : [],
      categories: event.categories ? event.categories.map(category => ({ id: category.id, name: category.name })) : [],
      status: event.status,
      created_at: event.created_at,
      created_by: event.created_by,
      modified_at: event.modified_at,
      modified_by: event.modified_by,
    };
  }
}
