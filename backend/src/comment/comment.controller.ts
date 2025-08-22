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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';


import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('comments')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  async findAll(): Promise<CommentResponseDto[]> {
    return this.commentService.findAll();
  }

  @Get('post/:post_id')
  async findByPost(@Param('post_id') post_id: string): Promise<CommentResponseDto[]> {
    return this.commentService.findByPost(post_id);
  }

  // @Get('post/:post_id/root')
  // async findRootComments(@Param('post_id') post_id: string): Promise<CommentResponseDto[]> {
  //   return this.commentService.findRootComments(post_id);
  // }

  // @Get(':id/replies')
  // async findReplies(@Param('id') id: string): Promise<CommentResponseDto[]> {
  //   return this.commentService.findReplies(id);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.commentService.remove(id);
  }
}

