import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToClass } from 'class-transformer';
import { Event, EventStatus } from './entity/event.entity';
import { EventQueryDto } from './dto/event-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private paginationService: PaginationService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    // Map DTO fields to entity fields
    const eventData = {
      ...createEventDto,
      public_status: createEventDto.public_status as EventStatus || EventStatus.DRAFT
    };
    
    const event = this.eventRepository.create(eventData);
    const savedEvent = await this.eventRepository.save(event);
    return this.findOne(savedEvent.id);
  }

  async searchAndPaginate(query: EventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    const { skip, take, page, limit } = this.paginationService.createPaginationOptions(query);
    
    const whereConditions: any = {};

    // Search condition
    if (query.search) {
      whereConditions.title = Like(`%${query.search}%`);
      whereConditions.description = Like(`%${query.search}%`);
    }

    // Status filter
    if (query.public_status) {
      whereConditions.public_status = query.public_status;
    }

    // Category filter
    if (query.event_category_id) {
      whereConditions.event_category_id = query.event_category_id;
    }

    // Date filters
    if (query.start_date || query.end_date) {
      if (query.start_date && query.end_date) {
        whereConditions.start_time = Between(new Date(query.start_date), new Date(query.end_date));
      } else if (query.start_date) {
        whereConditions.start_time = MoreThanOrEqual(new Date(query.start_date));
      } else if (query.end_date) {
        whereConditions.start_time = LessThanOrEqual(new Date(query.end_date));
      }
    }

    const [events, total] = await this.eventRepository.findAndCount({
      where: whereConditions,
      skip,
      take,
      order: { start_time: 'ASC' },
      relations: ['eventCategory', 'eventMedia'],
    });

    const responseDtos = events.map(event => 
      plainToClass(EventResponseDto, event, { excludeExtraneousValues: true })
    );

    return this.paginationService.createPaginatedResponse(
      responseDtos,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['eventCategory', 'eventMedia'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return plainToClass(EventResponseDto, event, { excludeExtraneousValues: true });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Map DTO fields to entity fields
    const updateData = {
      ...updateEventDto,
      public_status: updateEventDto.public_status as EventStatus || undefined
    };

    await this.eventRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['eventMedia'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.event_media && event.event_media.length > 0) {
      throw new Error(`Cannot delete event with associated media`);
    }

    await this.eventRepository.remove(event);
  }
}
