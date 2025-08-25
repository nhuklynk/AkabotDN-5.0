import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';
import { TagQueryDto } from './dto/tag-query.dto';
import { plainToClass } from 'class-transformer';
import { Tag } from './entity/tag.entity';
import { Status } from 'src/config/base-audit.entity';

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
    const tags = await this.tagRepository.find({
      order: { created_at: 'DESC' },
    });
    return tags.map(tag => plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true }));
  }

  async findPaginated(skip: number, take: number): Promise<[TagResponseDto[], number]> {
    const [tags, total] = await this.tagRepository.findAndCount({
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const tagDtos = tags.map(tag => 
      plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true })
    );

    return [tagDtos, total];
  }

  async findFilteredAndPaginated(query: TagQueryDto): Promise<[TagResponseDto[], number]> {
    const { page = 1, limit = 10, name, slug, search, date_from, date_to } = query;
    const skip = (page - 1) * limit;

    // Build query builder for search functionality
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');

    // Add where conditions
    if (name) {
      queryBuilder.andWhere('tag.name ILIKE :name', { name: `%${name}%` });
    }

    if (slug) {
      queryBuilder.andWhere('tag.slug ILIKE :slug', { slug: `%${slug}%` });
    }

    if (search) {
      queryBuilder.andWhere(
        '(tag.name ILIKE :search OR tag.description ILIKE :search OR tag.slug ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (date_from) {
      queryBuilder.andWhere('tag.created_at >= :date_from', { date_from });
    }

    if (date_to) {
      queryBuilder.andWhere('tag.created_at <= :date_to', { date_to });
    }

    // Add pagination and ordering
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('tag.created_at', 'DESC');

    const [tags, total] = await queryBuilder.getManyAndCount();

    const tagDtos = tags.map(tag => 
      plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true })
    );

    return [tagDtos, total];
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

    if (tag) {
      tag.status = Status.INACTIVE;
      await this.tagRepository.save(tag);
    }
  }
}
