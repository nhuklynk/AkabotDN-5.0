import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { EventMediaService } from './event-media.service';
import { EventMediaResponseDto } from './dto/event-media-response.dto';
import { CreateEventMediaDto } from './dto/create-event-media.dto';
import { UpdateEventMediaDto } from './dto/update-event-media.dto';
import { EventMediaQueryDto } from './dto/event-media-query.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('event-media') 
@Controller('event-media')
export class EventMediaController {
  constructor(private readonly eventMediaService: EventMediaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event media' })
  @ApiResponse({ status: 201, description: 'Event media created successfully', type: EventMediaResponseDto })
  async create(@Body() createEventMediaDto: CreateEventMediaDto): Promise<EventMediaResponseDto> {
    return this.eventMediaService.create(createEventMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all event media with filters and pagination' })
  @ApiQuery({ name: 'eventId', required: false, description: 'Filter by event ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starts from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number })
  @ApiResponse({ status: 200, description: 'Paginated list of event media' })
  async findAll(@Query() query: EventMediaQueryDto): Promise<PaginatedData<EventMediaResponseDto>> {
    return this.eventMediaService.searchAndPaginate(query);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all media for a specific event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'List of event media', type: [EventMediaResponseDto] })
  async findByEventId(@Param('eventId') eventId: string): Promise<EventMediaResponseDto[]> {
    return this.eventMediaService.findByEventId(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event media by ID' })
  @ApiParam({ name: 'id', description: 'Event media ID' })
  @ApiResponse({ status: 200, description: 'Event media found', type: EventMediaResponseDto })
  async findOne(@Param('id') id: string): Promise<EventMediaResponseDto> {
    return this.eventMediaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event media by ID' })
  @ApiParam({ name: 'id', description: 'Event media ID' })
  @ApiResponse({ status: 200, description: 'Event media updated successfully', type: EventMediaResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateEventMediaDto: UpdateEventMediaDto,
  ): Promise<EventMediaResponseDto> {
    return this.eventMediaService.update(id, updateEventMediaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete event media by ID' })
  @ApiParam({ name: 'id', description: 'Event media ID' })
  @ApiResponse({ status: 204, description: 'Event media deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventMediaService.remove(id);
  }
}
