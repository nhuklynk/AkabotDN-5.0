import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventService } from './event.service';

import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { CreateEventFormdataDto } from './dto/create-event.dto';
import { UpdateEventFormdataDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOperation({
    summary: 'Create a new event with form data',
    description: 'Creates a new event with form data support for file upload. The slug must be unique across all events. Tags and categories can be assigned using comma-separated UUIDs.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateEventFormdataDto,
    description: 'Event data including title, slug, description, location, dates, and thumbnail image upload',
  })
  @ApiCreatedResponse({
    description: 'Event created successfully with uploaded thumbnail',
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or slug already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async createWithFormData(
    @Body() createEventDto: CreateEventFormdataDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    return this.eventService.create(createEventDto, thumbnail);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all events',
    description: 'Retrieve all events with optional filtering and pagination. Supports filtering by title, location, status, date range, tags, and categories.',
  })
  @ApiOkResponse({
    description: 'Events retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title (partial match)' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location (partial match)' })
  @ApiQuery({ name: 'public_status', required: false, description: 'Filter by publication status' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Filter events from this date (ISO 8601)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Filter events to this date (ISO 8601)' })
  @ApiQuery({ name: 'tag_id', required: false, description: 'Filter by tag ID' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'countdown_enabled', required: false, description: 'Filter by countdown enabled' })
  async findAll(@Query() query: EventQueryDto): Promise<PaginatedData<EventResponseDto>> {
    return this.eventService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an event by ID',
    description: 'Retrieve a specific event by its UUID, including associated tags and categories.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Event found',
    type: EventResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  async findOne(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOperation({
    summary: 'Update an event with form data',
    description: 'Update a specific event with form data support for file upload. Tags and categories can be updated by providing comma-separated UUIDs.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateEventFormdataDto,
    description: 'Event update data including optional thumbnail image upload',
  })
  @ApiOkResponse({
    description: 'Event updated successfully',
    type: EventResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or slug already exists',
  })
  async updateWithFormData(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventFormdataDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ): Promise<EventResponseDto> {
    return this.eventService.update(id, updateEventDto, thumbnail);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Soft delete a specific event by its UUID. The event will be marked as deleted but not removed from the database.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Event deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(id);
  }
}
