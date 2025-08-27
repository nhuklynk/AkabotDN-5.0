import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { CreateMediaFormDataDto } from './dto/create-media-formdata.dto';
import { UpdateMediaFormDataDto } from './dto/update-media-formdata.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { MediaType } from './entity/media.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { MediaQueryDto } from './dto/media-query.dto';
import { MediaByTypeQueryDto } from './dto/media-by-type-query.dto';
import { PaginatedData } from 'src/common/interfaces/api-response.interface';
import { Public } from 'src/auth/decorators/public.decorator';
import { MediaStatisticsDto } from './dto/media-statistics.dto';
import { MediaContentStatisticsDto } from './dto/media-content-statistics.dto';

// Helper function to validate UUID
function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Get all media files',
    description: 'Retrieve a paginated list of all media files with optional search functionality. Supports pagination with page and limit parameters, and allows searching by media properties.'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number for pagination (default: 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of items per page (default: 10)' 
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String, 
    description: 'Search term to filter media files' 
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of media files with metadata including total count, current page, and total pages',
    type: [MediaResponseDto],
  })
  async findAll(@Query() query: MediaQueryDto): Promise<PaginatedData<MediaResponseDto>> {
    return this.mediaService.findAll(query);
  }

  @Public()
  @Get('statistics')
  @ApiOperation({ 
    summary: 'Get media statistics by type',
    description: 'Retrieve statistics showing the count of media files for each media type (post, event, member, other, document_video, document_image) along with the total count.'
  })
  @ApiResponse({
    status: 200,
    description: 'Media statistics retrieved successfully',
    type: MediaStatisticsDto,
  })
  async getStatistics(): Promise<MediaStatisticsDto> {
    return this.mediaService.getStatistics();
  }

  @Public()
  @Get('content-statistics')
  @ApiOperation({ 
    summary: 'Get media content statistics',
    description: 'Retrieve statistics grouped by content type: images (all image mime types), videos (all video mime types), and events (event media type). Returns both raw counts and formatted display strings.'
  })
  @ApiResponse({
    status: 200,
    description: 'Media content statistics retrieved successfully',
    type: MediaContentStatisticsDto,
  })
  async getContentStatistics(): Promise<MediaContentStatisticsDto> {
    return this.mediaService.getContentStatistics();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Media found',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async findOne(@Param('id') id: string): Promise<MediaResponseDto> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for media ID');
    }
    return this.mediaService.findOne(id);
  }

  @Public()
  @Get('type/:type')
  @ApiOperation({ 
    summary: 'Get media by type',
    description: 'Retrieve a paginated list of media files filtered by type with optional search functionality. Supports pagination with page and limit parameters, and allows searching by media properties.'
  })
  @ApiParam({ name: 'type', description: 'Media type (post, event, member, other)' })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number for pagination (default: 1)' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Number of items per page (default: 10)' 
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of media files filtered by type with metadata including total count, current page, and total pages',
    type: [MediaResponseDto],
  })
      async findByType(
      @Param('type') type: MediaType,
      @Query() query: MediaByTypeQueryDto
    ): Promise<PaginatedData<MediaResponseDto>> {
      return this.mediaService.findByType(type, query);
    }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload media file with form data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Media file to upload',
        },
        media_type: {
          type: 'string',
          enum: Object.values(MediaType),
          description: 'Media type classification',
        }
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file or input data',
  })
  async uploadMedia(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 1024 }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() createMediaFormDataDto: CreateMediaFormDataDto,
  ): Promise<MediaResponseDto> {
    return this.mediaService.createFromFormData(file, createMediaFormDataDto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update media by ID with optional file upload' })
  @ApiParam({ name: 'id', description: 'Media ID (UUID)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'New media file to upload (optional - replaces existing file)',
        },
        media_type: {
          type: 'string',
          enum: Object.values(MediaType),
          description: 'Media type classification',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Media updated successfully',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format or input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateMediaFormDataDto: UpdateMediaFormDataDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<MediaResponseDto> {
    return this.mediaService.updateFromFormData(id, file, updateMediaFormDataDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Media deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for media ID');
    }
    return this.mediaService.remove(id);
  }

  @Public()
  @Get('download/:id')
  @ApiOperation({ summary: 'Download media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Media downloaded successfully',
  })
  async download(@Param('id') id: string): Promise<any> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for media ID');
    }
    return this.mediaService.download(id);
  }
}

