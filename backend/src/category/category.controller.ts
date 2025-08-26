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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
// import { ApiResponse } from '../common/interfaces/api-response.interface';
// import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'Creates a new category with the provided information. The category will be created with default status "active" and current timestamp. Slug must be unique across all categories. This endpoint validates the input data and ensures data integrity before saving to the database.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description:
      'Category information including name (required), slug (required and must be unique), description (optional), and parent category ID (optional). The slug should be URL-friendly and unique across all categories.',
  })
  @SwaggerApiResponse({
    status: 201,
    description:
      'Category created successfully. Returns the newly created category with all its details including generated ID and timestamps.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Resource created successfully' },
        data: { $ref: '#/components/schemas/CategoryResponseDto' },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 400,
    description:
      'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.',
  })
  @SwaggerApiResponse({
    status: 409,
    description:
      'Conflict - Category with this slug already exists. Slug must be unique across all categories.',
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Search and filter categories with pagination',
    description:
      'Advanced search and filter endpoint that combines multiple filtering options with pagination. You can filter by name, slug, parent category, status, and perform text search across multiple fields. All filters are optional and can be combined.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description:
      'Page number to retrieve (starts from 1). Default is 1 if not specified.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Number of categories per page (maximum 100). Default is 10 if not specified.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description:
      'Filter categories by name using partial match (case-insensitive). Example: "tech" will match "Technology", "Technical", etc.',
  })
  @ApiQuery({
    name: 'slug',
    required: false,
    type: String,
    description:
      'Filter categories by slug using partial match (case-insensitive). Example: "web" will match "web-development", "web-design", etc.',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: String,
    description:
      'Filter categories by parent category ID. Only returns categories that are direct children of the specified parent category.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description:
      'Filter categories by status. Valid values: active, inactive, deleted, draft, published, archived.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search across multiple fields (name, description, slug) using partial match (case-insensitive). This is useful for general text search.',
  })
  @SwaggerApiResponse({
    status: 200,
    description:
      'Filtered and paginated list of categories retrieved successfully. Returns only categories that match the specified filters along with pagination metadata.',
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
              items: { $ref: '#/components/schemas/CategoryResponseDto' },
            },
            total: {
              type: 'number',
              example: 25,
              description: 'Total number of categories matching the filters',
            },
            page: {
              type: 'number',
              example: 1,
              description: 'Current page number',
            },
            limit: {
              type: 'number',
              example: 10,
              description: 'Number of items per page',
            },
            totalPages: {
              type: 'number',
              example: 3,
              description: 'Total number of pages for the filtered results',
            },
          },
        },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/search' },
      },
    },
  })
  async searchAndFilter(@Query() query: CategoryQueryDto) {
    const paginationOptions =
      this.paginationService.createPaginationOptions(query);
    const [items, total] =
      await this.categoryService.findFilteredAndPaginated(query);

    return this.paginationService.createPaginatedResponse(
      items,
      total,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  @Get('root')
  @ApiOperation({
    summary: 'Get root categories (categories without parent)',
    description:
      'Retrieves only root-level categories (categories that do not have a parent category). This is useful for building hierarchical category structures or displaying top-level categories.',
  })
  @SwaggerApiResponse({
    status: 200,
    description:
      'List of root categories retrieved successfully. Returns only categories that do not have a parent category.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request processed successfully' },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' },
        },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/root' },
      },
    },
  })
  async findRootCategories(): Promise<CategoryResponseDto[]> {
    return this.categoryService.findRootCategories();
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get category by slug',
    description:
      'Retrieves a specific category by its slug (URL-friendly identifier). Slugs are unique and provide a human-readable way to identify categories in URLs.',
  })
  @ApiParam({
    name: 'slug',
    description:
      'The unique slug identifier of the category (e.g., "technology", "web-development")',
  })
  @SwaggerApiResponse({
    status: 200,
    description:
      'Category found and retrieved successfully. Returns the complete category information including parent and child relationships.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request processed successfully' },
        data: { $ref: '#/components/schemas/CategoryResponseDto' },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/slug/technology' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 404,
    description:
      'Category not found. No category exists with the specified slug.',
  })
  async findBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return this.categoryService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get category by ID',
    description:
      'Retrieves a specific category by its unique UUID identifier. This is the most direct way to access a category when you have its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the category',
  })
  @SwaggerApiResponse({
    status: 200,
    description:
      'Category found and retrieved successfully. Returns the complete category information including parent and child relationships.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request processed successfully' },
        data: { $ref: '#/components/schemas/CategoryResponseDto' },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/123' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 404,
    description:
      'Category not found. No category exists with the specified ID.',
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update category by ID',
    description:
      'Updates an existing category with new information. Only the provided fields will be updated; other fields remain unchanged. Slug updates are validated for uniqueness.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the category to update',
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description:
      'Category information to update. Only include the fields you want to change.',
  })
  @SwaggerApiResponse({
    status: 200,
    description:
      'Category updated successfully. Returns the updated category with all current information.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Request processed successfully' },
        data: { $ref: '#/components/schemas/CategoryResponseDto' },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/123' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 404,
    description:
      'Category not found. No category exists with the specified ID.',
  })
  @SwaggerApiResponse({
    status: 409,
    description:
      'Conflict - Category with this slug already exists. Slug must be unique across all categories.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete category by ID',
    description:
      'Permanently deletes a category from the database. This action cannot be undone. The category and all its data will be permanently removed.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the category to delete',
  })
  @SwaggerApiResponse({
    status: 204,
    description:
      'Category deleted successfully. No content is returned as the category has been permanently removed.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 204 },
        message: { type: 'string', example: 'Resource deleted successfully' },
        data: { type: 'null', example: null },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/categories/123' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 404,
    description:
      'Category not found. No category exists with the specified ID.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
