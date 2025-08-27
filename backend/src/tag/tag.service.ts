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
import { PaginatedData } from 'src/common/interfaces/api-response.interface';

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

  async findAll(query: TagQueryDto): Promise<PaginatedData<TagResponseDto>> {
    const { page = 1, limit = 10, name, slug, search, date_from, date_to } = query;
    const skip = (page - 1) * limit;
  
    const qb = this.tagRepository
      .createQueryBuilder('tag')
      .orderBy('tag.created_at', 'DESC')
      .skip(skip)
      .take(limit);
  
    // Lọc theo name (case-insensitive)
    if (name) {
      qb.andWhere('LOWER(tag.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
  
    // Lọc theo slug (case-insensitive)
    if (slug) {
      qb.andWhere('LOWER(tag.slug) LIKE LOWER(:slug)', { slug: `%${slug}%` });
    }
  
    // Search nhiều field (name, slug, description)
    if (search) {
      qb.andWhere(
        '(LOWER(tag.name) LIKE LOWER(:search) OR LOWER(tag.slug) LIKE LOWER(:search) OR LOWER(tag.description) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }
  
    // Lọc theo khoảng thời gian
    if (date_from && date_to) {
      qb.andWhere('tag.created_at BETWEEN :date_from AND :date_to', {
        date_from,
        date_to,
      });
    } else if (date_from) {
      qb.andWhere('tag.created_at >= :date_from', { date_from });
    } else if (date_to) {
      qb.andWhere('tag.created_at <= :date_to', { date_to });
    }
  
    const [tags, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    const responseDtos = tags.map(tag =>
      plainToClass(TagResponseDto, tag, { excludeExtraneousValues: true })
    );
  
    return {
      items: responseDtos,
      total,
      page,
      limit,
      totalPages,
    };
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
    await this.tagRepository.delete(id);
  }
}
