import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { plainToClass } from 'class-transformer';
import { Tag } from './entity/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<TagResponseDto> {
    // Check if tag with slug already exists
    const existingTag = await this.tagRepository.findOne({
      where: { slug: createTagDto.slug },
    });

    if (existingTag) {
      throw new ConflictException('Tag with this slug already exists');
    }

    const tag = this.tagRepository.create(createTagDto);
    const savedTag = await this.tagRepository.save(tag);
    return plainToClass(TagResponseDto, savedTag, { excludeExtraneousValues: true });
  }

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.find();
    return tags.map(tag => plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findOne({
      where: { id: id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true });
  }

  async findBySlug(slug: string): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findOne({
      where: { slug: slug },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug ${slug} not found`);
    }

    return plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true });
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findOne({
      where: { id: id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    // Check if slug is being updated and if it already exists
    if (updateTagDto.slug && updateTagDto.slug !== tag.slug) {
      const existingTag = await this.tagRepository.findOne({
        where: { slug: updateTagDto.slug },
      });

      if (existingTag) {
        throw new ConflictException('Tag with this slug already exists');
      }
    }

    await this.tagRepository.update(id, updateTagDto);
    const updatedTag = await this.tagRepository.findOne({
      where: { id: id },
    });

    return plainToClass(TagResponseDto, updatedTag, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { id: id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    await this.tagRepository.remove(tag);
  }
}
