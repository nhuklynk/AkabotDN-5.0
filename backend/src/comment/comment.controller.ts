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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { NestedCommentResponseDto } from './dto/nested-comment-response.dto';
import { CommentQueryDto } from './dto/comment-query.dto';
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
import { CommentType } from './entity/comment.entity';

@Controller('comments')
@ApiTags('comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new comment',
    description: 'Creates a new comment with the provided content. The comment will be linked to a specific post and can optionally be a reply to another comment.'
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Comment information including content, post ID, and optional parent comment ID for replies.'
  })
  @ApiCreatedResponse({
    description: 'Comment created successfully. Returns the newly created comment with all its details including generated ID and timestamps.',
    type: CommentResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Advanced search and filter comments with pagination',
    description: 'Advanced search and filter endpoint that combines multiple filtering options with pagination. You can filter by post, author, parent comment, and perform text search across content. All filters are optional and can be combined.'
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
    description: 'Number of comments per page (maximum 100). Default is 10 if not specified.'
  })
  @ApiQuery({
    name: 'post_id',
    required: false,
    type: String,
    description: 'Filter comments by post ID. Only returns comments that belong to the specified post.'
  })
  @ApiQuery({
    name: 'parent_id',
    required: false,
    type: String,
    description: 'Filter comments by parent comment ID. Only returns replies to the specified comment.'
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: String,
    description: 'Filter comments by author ID. Only returns comments written by the specified user.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search across multiple fields (content) using partial match (case-insensitive).'
  })
  @ApiQuery({
    name: 'date_from',
    required: false,
    type: String,
    description: 'Filter comments by creation date range (start date). Format: YYYY-MM-DD'
  })
  @ApiQuery({
    name: 'date_to',
    required: false,
    type: String,
    description: 'Filter comments by creation date range (end date). Format: YYYY-MM-DD'
  })
  @ApiQuery({
    name: 'root_only',
    required: false,
    type: Boolean,
    description: 'Filter to show only root comments (comments without parent).'
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered and paginated list of comments retrieved successfully. Returns only comments that match the specified filters along with pagination metadata.',
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
              items: { $ref: '#/components/schemas/CommentResponseDto' },
            },
            total: { type: 'number', example: 25, description: 'Total number of comments matching the filters' },
            page: { type: 'number', example: 1, description: 'Current page number' },
            limit: { type: 'number', example: 10, description: 'Number of items per page' },
            totalPages: { type: 'number', example: 3, description: 'Total number of pages for the filtered results' },
          },
        },
        errors: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2025-08-22T11:25:00.000Z' },
        path: { type: 'string', example: '/api/comments/search' },
      },
    },
  })
  async searchAndFilter(@Query() query: CommentQueryDto) {
    const paginationOptions = this.paginationService.createPaginationOptions(query);
    const [items, total] = await this.commentService.findFilteredAndPaginated(query);
    
    return this.paginationService.createPaginatedResponse(
      items,
      total,
      paginationOptions.page,
      paginationOptions.limit,
    );
  }

  @Get('type/:comment_type/id/:comment_type_id/nested')
  @ApiOperation({
    summary: 'Get nested comments tree by type and ID',
    description: 'Retrieves all comments for a specific content in a nested tree structure where replies are contained within their parent comments. This provides a hierarchical view of the comment thread.'
  })
  @ApiParam({
    name: 'comment_type',
    description: 'The type of content (e.g., "post", "event")',
    example: 'post'
  })
  @ApiParam({
    name: 'comment_type_id',
    description: 'The UUID of the specific content item',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Nested comment tree for the specified type and ID retrieved successfully. Each root comment contains its replies in a hierarchical structure.',
    type: [NestedCommentResponseDto]
  })
  async findNestedCommentsByTypeAndId(
    @Param('comment_type') comment_type: CommentType,
    @Param('comment_type_id') comment_type_id: string
  ): Promise<NestedCommentResponseDto[]> {
    return this.commentService.findByCommentTypeAndId(comment_type, comment_type_id);
  }

  @Get(':id/replies')
  @ApiOperation({
    summary: 'Get replies to a comment',
    description: 'Retrieves all replies to a specific comment. This is useful for displaying nested comment threads.'
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the comment to get replies for',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'List of replies to the specified comment retrieved successfully.',
    type: [CommentResponseDto]
  })
  @ApiNotFoundResponse({
    description: 'Comment not found. No comment exists with the specified ID.'
  })
  async findReplies(@Param('id') id: string): Promise<CommentResponseDto[]> {
    return this.commentService.findReplies(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get comment by ID',
    description: 'Retrieves a specific comment using its unique UUID identifier. This is the most direct way to access a comment when you have its ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the comment',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Comment found and retrieved successfully. Returns the complete comment information including post and author details.',
    type: CommentResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Comment not found. No comment exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update comment by ID',
    description: 'Updates an existing comment with new information. Only the provided fields will be updated; other fields remain unchanged.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the comment to update',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateCommentDto,
    description: 'Comment information to update. Only include the fields you want to change.'
  })
  @ApiOkResponse({
    description: 'Comment updated successfully. Returns the updated comment with all current information.',
    type: CommentResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Invalid input data. Check that all required fields are provided and validation rules are met.'
  })
  @ApiNotFoundResponse({
    description: 'Comment not found. No comment exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete comment by ID',
    description: 'Permanently deletes a comment from the database. This action cannot be undone. The comment and all its associated data will be permanently removed.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID identifier of the comment to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Comment deleted successfully. No content is returned as the comment has been permanently removed.'
  })
  @ApiNotFoundResponse({
    description: 'Comment not found. No comment exists with the specified ID.'
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error - Something went wrong on the server side.'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.commentService.remove(id);
  }
}

