import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check slug duplicate
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    let parentCategory: Category | null = null;

    if (createCategoryDto.parent_id) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parent_id },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID ${createCategoryDto.parent_id} not found`,
        );
      }
    }

    // Tạo entity
    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      description: createCategoryDto.description,
      parent: parentCategory,
    });

    const savedCategory = await this.categoryRepository.save(category);
    return this.findOne(savedCategory.id);
  }

  async findPaginated(
    skip: number,
    take: number,
  ): Promise<[CategoryResponseDto[], number]> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    const categoryDtos = categories.map((category) =>
      plainToClass(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      }),
    );

    return [categoryDtos, total];
  }

  async findFilteredAndPaginated(
    query: CategoryQueryDto,
  ): Promise<[CategoryResponseDto[], number]> {
    const {
      page = 1,
      limit = 10,
      name,
      slug,
      parentId,
      status,
      search,
    } = query;
    const skip = (page - 1) * limit;

    // Build query builder for search functionality
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent');

    // Add where conditions
    if (name) {
      queryBuilder.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (slug) {
      queryBuilder.andWhere('LOWER(category.slug) LIKE LOWER(:slug)', {
        slug: `%${slug}%`,
      });
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
        '(LOWER(category.name) LIKE LOWER(:search) OR LOWER(category.description) LIKE LOWER(:search) OR LOWER(category.slug) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Add pagination and ordering
    queryBuilder.skip(skip).take(limit).orderBy('category.created_at', 'DESC');

    const [categories, total] = await queryBuilder.getManyAndCount();

    const categoryDtos = categories.map((category) =>
      plainToClass(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      }),
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

    return plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { slug: slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check slug duplicate
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Handle parent_id update (chỉ khi client có gửi parent_id)
    if (updateCategoryDto.parent_id !== undefined) {
      if (updateCategoryDto.parent_id === id) {
        throw new ConflictException('A category cannot be its own parent');
      }

      if (updateCategoryDto.parent_id) {
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parent_id },
        });

        if (!parentCategory) {
          throw new NotFoundException(
            `Parent category with ID ${updateCategoryDto.parent_id} not found`,
          );
        }

        category.parent = parentCategory;
      } else {
        // Trường hợp client gửi null => bỏ quan hệ cha
        category.parent = null;
      }
    }

    // Update các field còn lại
    Object.assign(category, {
      name: updateCategoryDto.name ?? category.name,
      slug: updateCategoryDto.slug ?? category.slug,
      description: updateCategoryDto.description ?? category.description,
    });

    const savedCategory = await this.categoryRepository.save(category);
    return plainToClass(CategoryResponseDto, savedCategory, {
      excludeExtraneousValues: true,
    });
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
    return categories.map((category) =>
      plainToClass(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
