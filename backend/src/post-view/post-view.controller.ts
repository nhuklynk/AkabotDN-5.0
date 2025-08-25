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
import { PostViewService } from './post-view.service';
import { CreatePostViewDto } from './dto/create-post-view.dto';
import { UpdatePostViewDto } from './dto/update-post-view.dto';
import { PostViewQueryDto } from './dto/post-view-query.dto';
import { PostViewResponseDto, PostViewStatisticsDto } from './dto/post-view-response.dto';
import { ApiResponse as IApiResponse, PaginatedApiResponse } from '../common/interfaces/api-response.interface';

@ApiTags('post-views')
@Controller('post-views')
export class PostViewController {
  constructor(private readonly postViewService: PostViewService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post view',
    description: 'Creates a new post view record to track when a post was viewed. If no time is provided, current timestamp is used.',
  })
  @ApiCreatedResponse({
    description: 'Post view created successfully',
    type: PostViewResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async create(@Body() createPostViewDto: CreatePostViewDto): Promise<IApiResponse<PostViewResponseDto>> {
    const data = await this.postViewService.create(createPostViewDto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Post view created successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views',
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all post views',
    description: 'Retrieve all post views with optional filtering and pagination. Supports filtering by post_id, date range, and pagination.',
  })
  @ApiOkResponse({
    description: 'Post views retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'post_id', required: false, description: 'Filter by post ID' })
  @ApiQuery({ name: 'from_date', required: false, description: 'Filter views from date (ISO 8601)' })
  @ApiQuery({ name: 'to_date', required: false, description: 'Filter views to date (ISO 8601)' })
  async findAll(@Query() query: PostViewQueryDto): Promise<PaginatedApiResponse<PostViewResponseDto>> {
    const data = await this.postViewService.findAll(query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Post views retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views',
    };
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get post view statistics',
    description: 'Get aggregated view statistics grouped by post_id. Includes view count, first view, and latest view timestamps.',
  })
  @ApiOkResponse({
    description: 'Statistics retrieved successfully',
    type: [PostViewStatisticsDto],
  })
  @ApiQuery({ name: 'post_id', required: false, description: 'Filter by specific post ID' })
  @ApiQuery({ name: 'from_date', required: false, description: 'Filter views from date (ISO 8601)' })
  @ApiQuery({ name: 'to_date', required: false, description: 'Filter views to date (ISO 8601)' })
  async getStatistics(@Query() query: PostViewQueryDto): Promise<IApiResponse<PostViewStatisticsDto[]>> {
    const data = await this.postViewService.getViewStatistics(query);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Statistics retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views/statistics',
    };
  }

  @Get('statistics/total')
  @ApiOperation({
    summary: 'Get total view count',
    description: 'Get the total number of post views with optional filtering by post_id and date range.',
  })
  @ApiOkResponse({
    description: 'Total count retrieved successfully',
  })
  @ApiQuery({ name: 'post_id', required: false, description: 'Filter by specific post ID' })
  @ApiQuery({ name: 'from_date', required: false, description: 'Filter views from date (ISO 8601)' })
  @ApiQuery({ name: 'to_date', required: false, description: 'Filter views to date (ISO 8601)' })
  async getTotalViews(
    @Query('post_id') postId?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ): Promise<IApiResponse<{ total: number }>> {
    const total = await this.postViewService.getTotalViews(postId, fromDate, toDate);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Total count retrieved successfully',
      data: { total },
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views/statistics/total',
    };
  }

  @Get('statistics/by-date')
  @ApiOperation({
    summary: 'Get views by date range',
    description: 'Get daily view counts within a specified date range.',
  })
  @ApiOkResponse({
    description: 'Daily statistics retrieved successfully',
  })
  @ApiQuery({ name: 'from_date', required: true, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to_date', required: true, description: 'End date (ISO 8601)' })
  @ApiBadRequestResponse({
    description: 'Both from_date and to_date are required',
  })
  async getViewsByDateRange(
    @Query('from_date') fromDate: string,
    @Query('to_date') toDate: string,
  ): Promise<IApiResponse<{ date: string; count: number }[]>> {
    const data = await this.postViewService.getViewsByDateRange(fromDate, toDate);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Daily statistics retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views/statistics/by-date',
    };
  }

  @Get('statistics/top-posts')
  @ApiOperation({
    summary: 'Get top viewed posts',
    description: 'Get the most viewed posts with view statistics, ordered by view count descending.',
  })
  @ApiOkResponse({
    description: 'Top posts retrieved successfully',
    type: [PostViewStatisticsDto],
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of top posts to return (default: 10)' })
  @ApiQuery({ name: 'from_date', required: false, description: 'Filter views from date (ISO 8601)' })
  @ApiQuery({ name: 'to_date', required: false, description: 'Filter views to date (ISO 8601)' })
  async getTopViewedPosts(
    @Query('limit') limit?: number,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ): Promise<IApiResponse<PostViewStatisticsDto[]>> {
    const data = await this.postViewService.getTopViewedPosts(limit, fromDate, toDate);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Top posts retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: '/api/post-views/statistics/top-posts',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a post view by ID',
    description: 'Retrieve a specific post view record by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post view UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Post view found',
    type: PostViewResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post view not found',
  })
  async findOne(@Param('id') id: string): Promise<IApiResponse<PostViewResponseDto>> {
    const data = await this.postViewService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Post view retrieved successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/post-views/${id}`,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post view',
    description: 'Update a specific post view record by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post view UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Post view updated successfully',
    type: PostViewResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Post view not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePostViewDto: UpdatePostViewDto,
  ): Promise<IApiResponse<PostViewResponseDto>> {
    const data = await this.postViewService.update(id, updatePostViewDto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Post view updated successfully',
      data,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/post-views/${id}`,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post view',
    description: 'Soft delete a specific post view record by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Post view UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Post view deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'Post view not found',
  })
  async remove(@Param('id') id: string): Promise<IApiResponse<null>> {
    await this.postViewService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Post view deleted successfully',
      data: null,
      errors: null,
      timestamp: new Date().toISOString(),
      path: `/api/post-views/${id}`,
    };
  }
}
