import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { MediaType } from './entity/media.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

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
  async findAll(): Promise<MediaResponseDto[]> {
    return this.mediaService.findAll();
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
  @ApiOperation({ summary: 'Create a new media file' })
  @ApiBody({ type: CreateMediaDto })
  @ApiResponse({
    status: 201,
    description: 'Media created successfully',
    type: MediaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async create(@Body() createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    return this.mediaService.create(createMediaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID (UUID)' })
  @ApiBody({ type: UpdateMediaDto })
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
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
  ): Promise<MediaResponseDto> {
    if (!validateUUID(id)) {
      throw new BadRequestException('Invalid UUID format for media ID');
    }
    return this.mediaService.update(id, updateMediaDto);
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
}

