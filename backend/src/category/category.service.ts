import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike, IsNull } from 'typeorm';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/config/base-audit.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Check if category with slug already exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    return this.findOne(savedCategory.id);
  }

  async findPaginated(skip: number, take: number): Promise<[CategoryResponseDto[], number]> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const categoryDtos = categories.map(category => 
      plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true })
    );

    return [categoryDtos, total];
  }

  async findFilteredAndPaginated(query: CategoryQueryDto): Promise<[CategoryResponseDto[], number]> {
    const { page = 1, limit = 10, name, slug, parentId, status, search } = query;
    const skip = (page - 1) * limit;

    // Build query builder for search functionality
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent');

    // Add where conditions
    if (name) {
      queryBuilder.andWhere('category.name ILIKE :name', { name: `%${name}%` });
    }

    if (slug) {
      queryBuilder.andWhere('category.slug ILIKE :slug', { slug: `%${slug}%` });
    }

    if (parentId) {
      queryBuilder.andWhere('parent.id = :parentId', { parentId });
    }

    if (status) {
      queryBuilder.andWhere('category.status = :status', { status });
    }

    // Add search functionality
    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search OR category.slug ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Add pagination and ordering
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('category.created_at', 'DESC');

    const [categories, total] = await queryBuilder.getManyAndCount();

    const categoryDtos = categories.map(category => 
      plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true })
    );

    return [categoryDtos, total];
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { slug: slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if slug is being updated and if it already exists
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (category) {
      category.status = Status.INACTIVE;
      await this.categoryRepository.save(category);
    }
  }

  async findRootCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      order: { created_at: 'DESC' },
    });
    return categories.map(category => plainToClass(CategoryResponseDto, category, { excludeExtraneousValues: true }));
  }
}


