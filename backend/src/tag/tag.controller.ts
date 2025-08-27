import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Creates a new tag with the provided information. The tag will be created with current timestamp. Slug must be unique across all tags.'
  })
  @ApiBody({
    type: CreateTagDto,
    description: 'Tag information including name, slug, and optional description. Slug must be unique and URL-friendly.'
  })
  @ApiCreatedResponse({
    description: 'Tag created successfully. Returns the newly created tag with all its details including generated ID and timestamps.',
    type: TagResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async create(@Body() createTagDto: CreateTagDto): Promise<TagResponseDto> {
    return this.tagService.create(createTagDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Advanced search and filter tags with pagination',
    description: 'Advanced search and filter endpoint that combines multiple filtering options with pagination. You can filter by name, slug, and perform text search across multiple fields. All filters are optional and can be combined.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number to retrieve (starts from 1). Default is 1 if not specified.'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of tags per page (maximum 100). Default is 10 if not specified.'
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter tags by name using partial match (case-insensitive). Example: "nest" will match "NestJS", "NestJS Tutorial", etc.'
  })
  @ApiQuery({
    name: 'slug',
    required: false,
    type: String,
    description: 'Filter tags by slug using partial match (case-insensitive). Example: "web" will match "web-development", "web-design", etc.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search across multiple fields (name, description, slug) using partial match (case-insensitive). This is useful for general text search.'
  })
  @ApiQuery({
    name: 'date_from',
    required: false,
    type: String,
    description: 'Filter tags by creation date range (start date). Format: YYYY-MM-DD'
  })
  @ApiQuery({
    name: 'date_to',
    required: false,
    type: String,
    description: 'Filter tags by creation date range (end date). Format: YYYY-MM-DD'
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered and paginated list of tags retrieved successfully. Returns only tags that match the specified filters along with pagination metadata.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request processed successfully' },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/TagResponseDto' },
            },
            total: { type: 'number', example: 25, description: 'Total number of tags matching the filters' },
            page: { type: 'number', example: 1, description: 'Current page number' },
            limit: { type: 'number', example: 10, description: 'Number of items per page' },
            totalPages: { type: 'number', example: 3, description: 'Total number of pages for the filtered results' },
          },
        },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/tags/search' },
      },
    },
  })
  async searchAndFilter(@Query() query: TagQueryDto) {
    const paginationOptions = this.paginationService.createPaginationOptions(query);
    const [items, total] = await this.tagService.findFilteredAndPaginated(query);
    
    return this.paginationService.createPaginatedResponse(
      items,
      total,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get tag by slug',
    description: 'Retrieves a specific tag using its URL-friendly slug. This is the preferred method for accessing tags in web applications as slugs are more user-friendly than UUIDs.'
  })
  @ApiParam({
    name: 'slug',
    description: 'The unique slug identifier of the tag (e.g., "nestjs", "web-development")',
    example: 'nestjs'
  })
  @ApiOkResponse({
    description: 'Tag found and retrieved successfully. Returns the complete tag information.',
    type: TagResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Tag not found. No tag exists with the specified slug.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async findBySlug(@Param('slug') slug: string): Promise<TagResponseDto> {
    return this.tagService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get tag by ID',
    description: 'Retrieves a specific tag using its unique UUID identifier. This is the most direct way to access a tag when you have its ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the tag',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Tag found and retrieved successfully. Returns the complete tag information.',
    type: TagResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Tag not found. No tag exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async findOne(@Param('id') id: string): Promise<TagResponseDto> {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update tag by ID',
    description: 'Updates an existing tag with new information. Only the provided fields will be updated; other fields remain unchanged. Slug updates are validated for uniqueness.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the tag to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateTagDto,
    description: 'Tag information to update. Only include the fields you want to change.'
  })
  @ApiOkResponse({
    description: 'Tag updated successfully. Returns the updated tag with all current information.',
    type: TagResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.'
  })
  @ApiNotFoundResponse({
    description: 'Tag not found. No tag exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete tag by ID',
    description: 'Permanently deletes a tag from the database. This action cannot be undone. The tag and all its associated data will be permanently removed.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the tag to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Tag deleted successfully. No content is returned as the tag has been permanently removed.'
  })
  @ApiNotFoundResponse({
    description: 'Tag not found. No tag exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tagService.remove(id);
  }
}

