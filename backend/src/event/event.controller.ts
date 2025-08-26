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

import { EventQueryDto, TagEventQueryDto, CategoryEventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { CreateEventFormdataDto } from './dto/create-event.dto';
import { UpdateEventFormdataDto } from './dto/update-event.dto';
import {
  EventStatisticsDto,
  MonthlyEventStatisticsDto,
  EventLocationStatisticsDto,
  EventCategoryStatisticsDto,
  EventTagStatisticsDto
} from './dto/event-statistics.dto';

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
  @ApiQuery({ name: 'start_date', required: false, description: 'Filter events from this date (ISO 8601)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Filter events to this date (ISO 8601)' })
  @ApiQuery({ name: 'tag_id', required: false, description: 'Filter by tag ID' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'countdown_enabled', required: false, description: 'Filter by countdown enabled' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
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

  @Get('tag/:tagId')
  @ApiOperation({
    summary: 'Get events by tag ID',
    description: 'Retrieve all events associated with a specific tag, with optional filtering and pagination.',
  })
  @ApiParam({
    name: 'tagId',
    description: 'Tag UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title (partial match)' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Filter events from this date (ISO 8601)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Filter events to this date (ISO 8601)' })
  @ApiOkResponse({
    description: 'Events retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Tag not found or no events found for this tag',
  })
  async findByTagId(
    @Param('tagId') tagId: string,
    @Query() query: TagEventQueryDto,
  ): Promise<PaginatedData<EventResponseDto>> {
    return this.eventService.findByTagId(tagId, query);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get events by category ID',
    description: 'Retrieve all events associated with a specific category, with optional filtering and pagination.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by title (partial match)' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Filter events from this date (ISO 8601)' })
  @ApiQuery({ name: 'end_date', required: false, description: 'Filter events to this date (ISO 8601)' })
  @ApiOkResponse({
    description: 'Events retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category not found or no events found for this category',
  })
  async findByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query() query: CategoryEventQueryDto,
  ): Promise<PaginatedData<EventResponseDto>> {
    return this.eventService.findByCategoryId(categoryId, query);
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

  @Get('statistics/overview')
  @ApiOperation({
    summary: 'Get general event statistics',
    description: 'Retrieves comprehensive statistics about events including total counts, status distribution, upcoming/past events, and other metrics.'
  })
  @ApiOkResponse({
    description: 'Event statistics retrieved successfully',
    type: EventStatisticsDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getEventStatistics(): Promise<EventStatisticsDto> {
    return this.eventService.getEventStatistics();
  }

  @Get('statistics/monthly')
  @ApiOperation({
    summary: 'Get monthly event statistics',
    description: 'Retrieves event creation statistics grouped by month for a specific year. Shows event count for each month of the year.'
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Year to get statistics for (default: current year)',
    example: 2024
  })
  @ApiOkResponse({
    description: 'Monthly event statistics retrieved successfully',
    type: [MonthlyEventStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getMonthlyEventStatistics(
    @Query('year') year?: number
  ): Promise<MonthlyEventStatisticsDto[]> {
    return this.eventService.getMonthlyEventStatistics(year);
  }

  @Get('statistics/by-location')
  @ApiOperation({
    summary: 'Get event statistics by location',
    description: 'Retrieves statistics showing the most popular event locations and their event counts. Results are ordered by event count in descending order.'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of locations to return (default: 10, max: 50)',
    example: 10
  })
  @ApiOkResponse({
    description: 'Location statistics retrieved successfully',
    type: [EventLocationStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getEventLocationStatistics(
    @Query('limit') limit?: number
  ): Promise<EventLocationStatisticsDto[]> {
    const locationLimit = Math.min(limit || 10, 50);
    return this.eventService.getEventLocationStatistics(locationLimit);
  }

  @Get('statistics/by-category')
  @ApiOperation({
    summary: 'Get event statistics by category',
    description: 'Retrieves statistics showing the most popular event categories and their event counts. Results are ordered by event count in descending order. Note: Since events can belong to multiple categories, the sum of percentages may exceed 100%.'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of categories to return (default: 10, max: 50)',
    example: 10
  })
  @ApiOkResponse({
    description: 'Category statistics retrieved successfully',
    type: [EventCategoryStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getEventCategoryStatistics(
    @Query('limit') limit?: number
  ): Promise<EventCategoryStatisticsDto[]> {
    const categoryLimit = Math.min(limit || 10, 50);
    return this.eventService.getEventCategoryStatistics(categoryLimit);
  }

  @Get('statistics/by-tag')
  @ApiOperation({
    summary: 'Get event statistics by tag',
    description: 'Retrieves statistics showing the most popular event tags and their event counts. Results are ordered by event count in descending order. Note: Since events can have multiple tags, the sum of percentages may exceed 100%.'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of tags to return (default: 10, max: 50)',
    example: 10
  })
  @ApiOkResponse({
    description: 'Tag statistics retrieved successfully',
    type: [EventTagStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getEventTagStatistics(
    @Query('limit') limit?: number
  ): Promise<EventTagStatisticsDto[]> {
    const tagLimit = Math.min(limit || 10, 50);
    return this.eventService.getEventTagStatistics(tagLimit);
  }
}
