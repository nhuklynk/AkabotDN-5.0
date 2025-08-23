import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventMediaDto } from './dto/create-event-media.dto';
import { UpdateEventMediaDto } from './dto/update-event-media.dto';
import { EventMediaResponseDto } from './dto/event-media-response.dto';
import { plainToClass } from 'class-transformer';
import { EventMedia } from './entity/event-media.entity';
import { EventMediaQueryDto } from './dto/event-media-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';

@Injectable()
export class EventMediaService {
  constructor(
    @InjectRepository(EventMedia)
    private eventMediaRepository: Repository<EventMedia>,
    private paginationService: PaginationService,
  ) {}

  async create(createEventMediaDto: CreateEventMediaDto): Promise<EventMediaResponseDto> {
    const eventMedia = this.eventMediaRepository.create(createEventMediaDto);
    const savedEventMedia = await this.eventMediaRepository.save(eventMedia);
    return this.findOne(savedEventMedia.id);
  }

  async searchAndPaginate(query: EventMediaQueryDto): Promise<PaginatedData<EventMediaResponseDto>> {
    const { skip, take, page, limit } = this.paginationService.createPaginationOptions(query);
    
    const whereCondition = query.eventId 
      ? { event_id: query.eventId }
      : {};

    const [eventMedia, total] = await this.eventMediaRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      order: { created_at: 'DESC' },
      relations: ['event'],
    });

    const responseDtos = eventMedia.map(media => 
      plainToClass(EventMediaResponseDto, media, { excludeExtraneousValues: true })
    );

    return this.paginationService.createPaginatedResponse(
      responseDtos,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<EventMediaResponseDto> {
    const eventMedia = await this.eventMediaRepository.findOne({
      where: { id: id },
      relations: ['event'],
    });

    if (!eventMedia) {
      throw new NotFoundException(`Event media with ID ${id} not found`);
    }

    return plainToClass(EventMediaResponseDto, eventMedia, { excludeExtraneousValues: true });
  }

  async update(id: string, updateEventMediaDto: UpdateEventMediaDto): Promise<EventMediaResponseDto> {
    const eventMedia = await this.eventMediaRepository.findOne({
      where: { id: id },
    });

    if (!eventMedia) {
      throw new NotFoundException(`Event media with ID ${id} not found`);
    }

    await this.eventMediaRepository.update(id, updateEventMediaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const eventMedia = await this.eventMediaRepository.findOne({
      where: { id: id },
    });

    if (!eventMedia) {
      throw new NotFoundException(`Event media with ID ${id} not found`);
    }

    await this.eventMediaRepository.remove(eventMedia);
  }

  async findByEventId(eventId: string): Promise<EventMediaResponseDto[]> {
    const eventMedia = await this.eventMediaRepository.find({
      where: { event_id: eventId },
      relations: ['event'],
      order: { created_at: 'ASC' },
    });

    return eventMedia.map(media => 
      plainToClass(EventMediaResponseDto, media, { excludeExtraneousValues: true })
    );
  }
}
