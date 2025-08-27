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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { CreatePostFormdataDto } from './dto/create-post-formdata.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostQueryDto, TagPostQueryDto, CategoryPostQueryDto } from './dto/post-query.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginationService } from '../common/services/pagination.service';
import { PaginatedData } from '../common/interfaces/api-response.interface';
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
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdatePostFormdataDto } from './dto/update-post-formdata.dto';
import { 
  PostStatisticsDto, 
  PostTypeStatisticsResponseDto,
  PostAuthorStatisticsDto,
  MonthlyPostStatisticsDto,
  PostTypeDetailedStatisticsDto
} from './dto/post-statistics.dto';
import { PostType } from './entity/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('featured_image'))
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Creates a new blog post with the provided data. The post will be created with default status "draft" and current timestamp. Slug must be unique across all posts. Categories and tags can be assigned using their UUIDs.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreatePostFormdataDto,
    description:
      'Post data including title, slug, content, status, categories, tags, author information, and featured image. Slug must be unique and URL-friendly.',
  })
  @ApiCreatedResponse({
    description:
      'Post created successfully. Returns the newly created post with all its details including generated ID, timestamps, and relationships.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error - Something went wrong on the server side.',
  })
  create(
    @Body() createPostFormdataDto: CreatePostFormdataDto,
    @UploadedFile() featuredImage?: any,
  ): Promise<PostResponseDto> {
    return this.postService.create(createPostFormdataDto, featuredImage);
  }

  @Get()
  @ApiOperation({
    summary: 'Advanced search and filter posts with pagination',
    description:
      'Advanced search and filter endpoint that combines multiple filtering options with pagination. You can filter by status, category, tag, author, date range, and perform text search across titles and content. All filters are optional and can be combined.',
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
      'Number of posts per page (maximum 100). Default is 10 if not specified.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description:
      'Filter posts by publication status. Valid values: draft, published, archived.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description:
      'Filter posts by category slug. Only returns posts that belong to the specified category.',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    type: String,
    description:
      'Filter posts by tag slug. Only returns posts that have the specified tag.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search across multiple fields (title, content) using partial match (case-insensitive).',
  })
  @ApiQuery({
    name: 'author_id',
    required: false,
    type: String,
    description:
      'Filter posts by author ID. Only returns posts written by the specified user.',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description:
      'Filter posts by type. Valid values: member_activity, association_activity, digital_product.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Filtered and paginated list of posts retrieved successfully. Returns only posts that match the specified filters along with pagination metadata.',
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
              items: { $ref: '#/components/schemas/PostResponseDto' },
            },
            total: {
              type: 'number',
              example: 50,
              description: 'Total number of posts matching the filters',
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
              example: 5,
              description: 'Total number of pages for the filtered results',
            },
          },
        },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/posts/search' },
      },
    },
  })
  async searchAndFilter(@Query() query: PostQueryDto) {
    const paginationOptions =
      this.paginationService.createPaginationOptions(query);
    const [items, total] =
      await this.postService.findFilteredAndPaginated(query);

    return this.paginationService.createPaginatedResponse(
      items,
      total,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get post by slug',
    description:
      'Retrieves a specific post using its URL-friendly slug. This is the preferred method for accessing posts in web applications as slugs are more user-friendly than UUIDs.',
  })
  @ApiParam({
    name: 'slug',
    description:
      'The unique slug identifier of the post (e.g., "getting-started-with-nestjs", "api-design-best-practices")',
    example: 'getting-started-with-nestjs',
  })
  @ApiOkResponse({
    description:
      'Post found and retrieved successfully. Returns the complete post information including author, categories, tags, and comments.',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post not found. No post exists with the specified slug.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error - Something went wrong on the server side.',
  })
  findBySlug(@Param('slug') slug: string): Promise<PostResponseDto> {
    return this.postService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description:
      'Retrieves a specific post using its unique UUID identifier. This is the most direct way to access a post when you have its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'Post found and retrieved successfully. Returns the complete post information including author, categories, tags, and comments.',
    type: PostResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post not found. No post exists with the specified ID.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error - Something went wrong on the server side.',
  })
  findOne(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.findOne(id);
  }

  @Get('tag/:tagId')
  @ApiOperation({
    summary: 'Get posts by tag ID',
    description: 'Retrieve all posts associated with a specific tag, with optional filtering and pagination.',
  })
  @ApiParam({
    name: 'tagId',
    description: 'Tag UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiOkResponse({
    description: 'Posts retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Tag not found or no posts found for this tag',
  })
  async findByTagId(
    @Param('tagId') tagId: string,
    @Query() query: TagPostQueryDto,
  ): Promise<PaginatedData<PostResponseDto>> {
    return this.postService.findByTagId(tagId, query);
  }

  @Get('category/:categoryId')
  @ApiOperation({
    summary: 'Get posts by category ID',
    description: 'Retrieve all posts associated with a specific category, with optional filtering and pagination.',
  })
  @ApiParam({
    name: 'categoryId',
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiOkResponse({
    description: 'Posts retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category not found or no posts found for this category',
  })
  async findByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query() query: CategoryPostQueryDto,
  ): Promise<PaginatedData<PostResponseDto>> {
    return this.postService.findByCategoryId(categoryId, query);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('featured_image'))
  @ApiOperation({
    summary: 'Update post by ID',
    description:
      'Updates an existing post with new information including optional featured image upload. Only the provided fields will be updated; other fields remain unchanged. Slug updates are validated for uniqueness. Categories and tags can be updated by providing arrays of UUIDs. Featured image can be uploaded as multipart file.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the post to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdatePostFormdataDto,
    description:
      'Post information to update with optional featured image. Only include the fields you want to change. Categories and tags should be arrays of UUIDs.',
  })
  @ApiOkResponse({
    description:
      'Post updated successfully. Returns the updated post with all current information including new featured image if uploaded.',
    type: PostResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found. No post exists with the specified ID.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error - Something went wrong on the server side.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostFormdataDto,
    @UploadedFile() featuredImage?: any,
  ): Promise<PostResponseDto> {
    return this.postService.update(id, updatePostDto, featuredImage);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete post by ID',
    description:
      'Permanently deletes a post from the database. This action cannot be undone. The post and all its associated data (comments, relationships) will be permanently removed.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the post to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description:
      'Post deleted successfully. No content is returned as the post has been permanently removed.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found. No post exists with the specified ID.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'Internal server error - Something went wrong on the server side.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.postService.remove(id);
  }

  @Get('statistics/overview')
  @ApiOperation({
    summary: 'Get general post statistics',
    description: 'Retrieves comprehensive statistics about posts including total counts, status distribution, and recent activity metrics.'
  })
  @ApiOkResponse({
    description: 'Post statistics retrieved successfully',
    type: PostStatisticsDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getPostStatistics(): Promise<PostStatisticsDto> {
    return this.postService.getPostStatistics();
  }

  @Get('statistics/by-type')
  @ApiOperation({
    summary: 'Get post statistics by type',
    description: 'Retrieves statistics showing the distribution of posts across different post types (MEMBER_ACTIVITY, ASSOCIATION_ACTIVITY, DIGITAL_PRODUCT).'
  })
  @ApiOkResponse({
    description: 'Post type statistics retrieved successfully',
    type: PostTypeStatisticsResponseDto
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getPostTypeStatistics(): Promise<PostTypeStatisticsResponseDto> {
    return this.postService.getPostTypeStatistics();
  }

  @Get('statistics/by-type/:postType')
  @ApiOperation({
    summary: 'Get detailed statistics for a specific post type',
    description: 'Retrieves comprehensive statistics for a specific post type including counts, status distribution, recent activity, and monthly breakdown.'
  })
  @ApiParam({
    name: 'postType',
    description: 'The post type to get statistics for',
    enum: PostType,
    example: PostType.MEMBER_ACTIVITY
  })
  @ApiOkResponse({
    description: 'Detailed post type statistics retrieved successfully',
    type: PostTypeDetailedStatisticsDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid post type provided'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getPostTypeDetailedStatistics(
    @Param('postType') postType: PostType
  ): Promise<PostTypeDetailedStatisticsDto> {
    // Validate post type
    if (!Object.values(PostType).includes(postType)) {
      throw new BadRequestException('Invalid post type');
    }
    return this.postService.getPostTypeDetailedStatistics(postType);
  }

  @Get('statistics/by-author')
  @ApiOperation({
    summary: 'Get post statistics by author',
    description: 'Retrieves statistics showing the most prolific authors and their post counts. Results are ordered by post count in descending order.'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of authors to return (default: 10, max: 50)',
    example: 10
  })
  @ApiOkResponse({
    description: 'Author statistics retrieved successfully',
    type: [PostAuthorStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getPostAuthorStatistics(
    @Query('limit') limit?: number
  ): Promise<PostAuthorStatisticsDto[]> {
    const authorLimit = Math.min(limit || 10, 50);
    return this.postService.getPostAuthorStatistics(authorLimit);
  }

  @Get('statistics/monthly')
  @ApiOperation({
    summary: 'Get monthly post statistics',
    description: 'Retrieves post creation statistics grouped by month for a specific year. Shows post count for each month of the year.'
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Year to get statistics for (default: current year)',
    example: 2024
  })
  @ApiOkResponse({
    description: 'Monthly statistics retrieved successfully',
    type: [MonthlyPostStatisticsDto]
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async getMonthlyPostStatistics(
    @Query('year') year?: number
  ): Promise<MonthlyPostStatisticsDto[]> {
    return this.postService.getMonthlyPostStatistics(year);
  }
}
