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
import { PaginatedData } from 'src/common/interfaces/api-response.interface';

// Helper function to validate UUID
function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all media files' })
  @ApiResponse({
    status: 200,
    description: 'List of all media files',
    type: [MediaResponseDto],
  })
  async findAll(@Query() query: MediaQueryDto): Promise<PaginatedData<MediaResponseDto>> {
    return this.mediaService.findAll(query);
  }

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

  @Get('type/:type')
  @ApiOperation({ summary: 'Get media by type' })
  @ApiParam({ name: 'type', description: 'Media type' })
  @ApiResponse({
    status: 200,
    description: 'List of media files by type',
    type: [MediaResponseDto],
  })
  async findByType(@Param('type') type: MediaType): Promise<MediaResponseDto[]> {
    return this.mediaService.findByType(type);
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
          enum: ['post', 'event', 'member', 'other'],
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
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
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

