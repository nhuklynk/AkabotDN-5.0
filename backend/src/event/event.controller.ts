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
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { ApiResponse as IApiResponse, PaginatedApiResponse } from '../common/interfaces/api-response.interface';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided data. The slug must be unique across all events. Tags and categories can be assigned using their UUIDs.',
  })
  @ApiCreatedResponse({
    description: 'Event created successfully',
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or slug already exists',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<IApiResponse<EventResponseDto>> {
    const data = await this.eventService.create(createEventDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Event created successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/events',
    };
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
  async findAll(@Query() query: EventQueryDto): Promise<PaginatedApiResponse<EventResponseDto>> {
    const data = await this.eventService.findAll(query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Events retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/events',
    };
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
  async findOne(@Param('id') id: string): Promise<IApiResponse<EventResponseDto>> {
    const data = await this.eventService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/events/${id}`,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an event',
    description: 'Update a specific event by its UUID. Tags and categories can be updated by providing their UUIDs.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
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
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<IApiResponse<EventResponseDto>> {
    const data = await this.eventService.update(id, updateEventDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event updated successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/events/${id}`,
    };
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
  async remove(@Param('id') id: string): Promise<IApiResponse<null>> {
    await this.eventService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Event deleted successfully',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/events/${id}`,
    };
  }
}
