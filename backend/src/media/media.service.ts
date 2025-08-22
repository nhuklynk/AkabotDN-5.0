import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media, MediaType } from './entity/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {}

  async findAll(): Promise<MediaResponseDto[]> {
    const media = await this.mediaRepository.find({
      relations: ['uploaded_by', 'posts'],
    });
    return media.map(media => plainToClass(MediaResponseDto, media, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
      relations: ['uploaded_by', 'posts'],
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return plainToClass(MediaResponseDto, media, { excludeExtraneousValues: true });
  }

  async findByType(media_type: MediaType): Promise<MediaResponseDto[]> {
    const media = await this.mediaRepository.find({
      where: { media_type: media_type },
      relations: ['uploaded_by'],
    });
    return media.map(media => plainToClass(MediaResponseDto, media, { excludeExtraneousValues: true }));
  }


  async create(createMediaDto: CreateMediaDto): Promise<MediaResponseDto> {
    const media = this.mediaRepository.create({
      ...createMediaDto
    });

    const savedMedia = await this.mediaRepository.save(media);
    return this.findOne(savedMedia.id);
  }

  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<MediaResponseDto> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    await this.mediaRepository.update(id, updateMediaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const media = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    await this.mediaRepository.remove(media);
  }
}
