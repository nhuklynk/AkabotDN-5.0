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

  /**
   * Helper method to properly transform category entity to DTO with children
   */
  private async transformToDtoWithChildren(category: Category): Promise<CategoryResponseDto> {
    const dto = plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
    
    dto.children = await this.getChildrenForCategory(category.id);
    
    return dto;
  }

  /**
   * Helper method to get children for a specific category
   */
  private async getChildrenForCategory(parentId: string): Promise<CategoryResponseDto[]> {
    const children = await this.categoryRepository.find({
      where: { parent: { id: parentId } },
      relations: ['parent'],
      order: { created_at: 'DESC' },
    });

    const childDtos: CategoryResponseDto[] = [];
    for (const child of children) {
      const childDto = await this.transformToDtoWithChildren(child);
      childDtos.push(childDto);
    }

    return childDtos;
  }

  /**
   * Helper method for simple transformation without children (used internally)
   */
  private transformToDto(category: Category): CategoryResponseDto {
    const dto = plainToClass(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
    
    return dto;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
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
      relations: ['parent'],
      order: { created_at: 'DESC' },
    });

    const categoryDtos: CategoryResponseDto[] = [];
    for (const category of categories) {
      const dto = await this.transformToDtoWithChildren(category);
      categoryDtos.push(dto);
    }

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

    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent');

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

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(category.name) LIKE LOWER(:search) OR LOWER(category.description) LIKE LOWER(:search) OR LOWER(category.slug) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    queryBuilder.skip(skip).take(limit).orderBy('category.created_at', 'DESC');

    const [categories, total] = await queryBuilder.getManyAndCount();

    const categoryDtos: CategoryResponseDto[] = [];
    for (const category of categories) {
      const dto = await this.transformToDtoWithChildren(category);
      categoryDtos.push(dto);
    }

    return [categoryDtos, total];
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return await this.transformToDtoWithChildren(category);
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { slug: slug },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return await this.transformToDtoWithChildren(category);
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

    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

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
        category.parent = null;
      }
    }

    Object.assign(category, {
      name: updateCategoryDto.name ?? category.name,
      slug: updateCategoryDto.slug ?? category.slug,
      description: updateCategoryDto.description ?? category.description,
    });

    const savedCategory = await this.categoryRepository.save(category);
    return this.findOne(savedCategory.id);
  }

  async remove(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async findRootCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: ['parent'],
      order: { created_at: 'DESC' },
    });

    return categories.map((category) => this.transformToDto(category));
  }

  /**
   * Build full category tree with all categories organized by parent-child relationships
   */
  async buildCategoryTree(): Promise<CategoryResponseDto[]> {
    const allCategories = await this.categoryRepository.find({
      relations: ['parent'],
      order: { created_at: 'DESC' },
    });

    return this.buildTreeFromEntities(allCategories);
  }

  /**
   * Build category subtree starting from a specific parent category
   */
  async buildCategorySubTree(parentId: string): Promise<CategoryResponseDto[]> {
    const parentCategory = await this.categoryRepository.findOne({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new NotFoundException(`Parent category with ID ${parentId} not found`);
    }

    const allCategories = await this.getCategoryDescendants(parentId);

    const tree = this.buildTreeFromEntities(allCategories);

    const directChildren = allCategories.filter(cat => 
      cat.parent && cat.parent.id === parentId
    );

    return this.buildTreeFromEntities(allCategories).filter(dto => {
      return directChildren.some(child => child.id === dto.id);
    });
  }

  /**
   * Build complete category tree with detailed parent-child relationships
   */
  async buildDetailedCategoryTree(): Promise<CategoryResponseDto[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .orderBy('category.created_at', 'DESC');

    const categories = await queryBuilder.getMany();

    return this.buildTreeFromEntities(categories);
  }

  /**
   * Helper method to build tree structure from Category entities
   */
  private buildTreeFromEntities(entities: Category[]): CategoryResponseDto[] {
    const categoryMap = new Map<string, CategoryResponseDto>();
    const rootCategories: CategoryResponseDto[] = [];

    const categoryDtos = entities.map((entity) => {
      const dto = this.transformToDto(entity);
      dto.children = [];
      categoryMap.set(dto.id, dto);
      return { dto, entity };
    });

    categoryDtos.forEach(({ dto, entity }) => {
      if (entity.parent && entity.parent.id) {
        const parentDto = categoryMap.get(entity.parent.id);
        if (parentDto) {
          parentDto.children!.push(dto);
        }
      } else {
        rootCategories.push(dto);
      }
    });

    this.sortCategoriesRecursively(rootCategories);

    return rootCategories;
  }

  /**
   * Helper method to build tree structure from flat array of categories (legacy)
   */
  private buildTree(categories: CategoryResponseDto[]): CategoryResponseDto[] {
    const categoryMap = new Map<string, CategoryResponseDto>();
    const rootCategories: CategoryResponseDto[] = [];

    categories.forEach(category => {
      category.children = [];
      categoryMap.set(category.id, category);
    });
    
    return rootCategories;
  }

  /**
   * Recursively sort categories and their children by created_at desc
   */
  private sortCategoriesRecursively(categories: CategoryResponseDto[]): void {
    categories.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    categories.forEach(category => {
      if (category.children && category.children.length > 0) {
        this.sortCategoriesRecursively(category.children);
      }
    });
  }

  /**
   * Sort children of a specific category recursively
   */
  private sortCategoryChildren(category: CategoryResponseDto): void {
    if (category.children && category.children.length > 0) {
      category.children.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      category.children.forEach(child => {
        this.sortCategoryChildren(child);
      });
    }
  }

  /**
   * Get all descendants of a category recursively
   */
  private async getCategoryDescendants(parentId: string): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent');

    const query = `
      WITH RECURSIVE category_tree AS (
        -- Base case: direct children
        SELECT * FROM categories WHERE parent_id = $1
        UNION ALL
        -- Recursive case: children of children
        SELECT c.* FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT * FROM category_tree ORDER BY created_at DESC
    `;

    const descendants = await this.categoryRepository.query(query, [parentId]);
    
    return descendants.map((raw: any) => {
      const category = new Category();
      Object.assign(category, raw);
      return category;
    });
  }

  /**
   * Get category tree with depth information
   */
  async getCategoryTreeWithDepth(): Promise<(CategoryResponseDto & { depth: number })[]> {
    const tree = await this.buildCategoryTree();
    
    const addDepthToTree = (
      categories: CategoryResponseDto[], 
      depth: number = 0
    ): (CategoryResponseDto & { depth: number })[] => {
      return categories.map(category => {
        const categoryWithDepth = { ...category, depth };
        
        if (category.children && category.children.length > 0) {
          categoryWithDepth.children = addDepthToTree(category.children, depth + 1);
        }
        
        return categoryWithDepth;
      });
    };

    return addDepthToTree(tree);
  }

  /**
   * Get flattened category tree (all categories in flat array with depth info)
   */
  async getFlattenedCategoryTree(): Promise<(CategoryResponseDto & { depth: number })[]> {
    const treeWithDepth = await this.getCategoryTreeWithDepth();
    
    const flattenTree = (
      categories: (CategoryResponseDto & { depth: number })[]
    ): (CategoryResponseDto & { depth: number })[] => {
      const result: (CategoryResponseDto & { depth: number })[] = [];
      
      categories.forEach(category => {
        const flatCategory = { ...category };
        delete flatCategory.children;
        result.push(flatCategory);
        
        if (category.children && category.children.length > 0) {
          result.push(...flattenTree(category.children as (CategoryResponseDto & { depth: number })[]));
        }
      });
      
      return result;
    };

    return flattenTree(treeWithDepth);
  }
}
