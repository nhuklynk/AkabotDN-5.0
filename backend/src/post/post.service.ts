import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToClass } from 'class-transformer';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { Category } from 'src/category/entity/category.entity';
import { PostQueryDto, TagPostQueryDto, CategoryPostQueryDto } from './dto/post-query.dto';
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';
import { Status } from 'src/config/base-audit.entity';
import { Tag } from 'src/tag/entity/tag.entity';
import { UserService } from 'src/user/user.service';
import { CreatePostFormdataDto } from './dto/create-post-formdata.dto';
import { UpdatePostFormdataDto } from './dto/update-post-formdata.dto';
import { PostViewService } from 'src/post-view/post-view.service';
import { 
  PostStatisticsDto, 
  PostTypeStatisticsDto, 
  PostTypeStatisticsResponseDto,
  PostAuthorStatisticsDto,
  MonthlyPostStatisticsDto,
  PostTypeDetailedStatisticsDto
} from './dto/post-statistics.dto';
import { PostType } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private storageService: StorageService,
    private mediaService: MediaService,
    private userService: UserService,
    private postViewService: PostViewService,
  ) {}

  private normalizeIds(ids?: string): string[] | undefined {
    if (!ids) return undefined;
    return ids
      .split(',')
      .map((id) => id.trim())
      .filter((id) => !!id);
  }

  async create(
    createPostDto: CreatePostFormdataDto,
    featuredImage?: Express.Multer.File,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findOne(createPostDto.user_id);
    if (!user) throw new NotFoundException('User not found');

    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostDto.slug },
    });
    if (existingPost)
      throw new ConflictException('Post with this slug already exists');

    const categoryIds = this.normalizeIds(createPostDto.category_ids);
    const tagIds = this.normalizeIds(createPostDto.tag_ids);

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      slug: createPostDto.slug,
      summary: createPostDto.summary,
      status: createPostDto.status,
      post_type: createPostDto.post_type,
      user: user,
      published_at: createPostDto.published_at
        ? new Date(createPostDto.published_at)
        : undefined,
    });

    if (categoryIds?.length) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      post.categories = categories;
    }
    if (tagIds?.length) {
      const tags = await this.tagRepository.findBy({ id: In(tagIds) });
      post.tags = tags;
    }

    if (createPostDto.status === Status.ACTIVE) {
      post.published_at = new Date();
    }

    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      post.media_id = media.id;
    }

    const savedPost = await this.postRepository.save(post);
    return plainToClass(PostResponseDto, savedPost, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostFormdataDto,
    featuredImage?: Express.Multer.File,
  ): Promise<PostResponseDto> {
    const user = updatePostDto.user_id
      ? await this.userService.findOne(updatePostDto.user_id)
      : null;
    if (updatePostDto.user_id && !user)
      throw new NotFoundException('User not found');

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['categories', 'tags'],
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    const categoryIds = this.normalizeIds(updatePostDto.category_ids);
    const tagIds = this.normalizeIds(updatePostDto.tag_ids);

    if (categoryIds?.length) {
      post.categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
    }
    if (tagIds?.length) {
      post.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }

    if (updatePostDto.status === Status.PUBLISHED) {
      post.published_at = new Date();
    }

    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      post.media_id = media.id;
    }

    if (updatePostDto.post_type) {
      post.post_type = updatePostDto.post_type;
    }

    Object.assign(post, {
      ...updatePostDto,
      published_at: updatePostDto.published_at
        ? new Date(updatePostDto.published_at)
        : post.published_at,
    });

    const updatedPost = await this.postRepository.save(post);
    return plainToClass(PostResponseDto, updatedPost, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (post) {
      post.status = Status.INACTIVE;
      await this.postRepository.save(post);
    }
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'categories', 'tags'],
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    const postView = await this.postViewService.create({ post_id: id });
    return plainToClass(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { slug },
      relations: ['user', 'categories', 'tags'],
    });
    if (!post) throw new NotFoundException(`Post with slug ${slug} not found`);
    return plainToClass(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findByCategory(category_id: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('category.id = :category_id', { category_id })
      .getMany();

    return posts.map((post) =>
      plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }),
    );
  }

  async findByTag(tag_id: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('tag.id = :tag_id', { tag_id })
      .getMany();

    return posts.map((post) =>
      plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }),
    );
  }

  async findByTagId(tagId: string, queryDto?: TagPostQueryDto): Promise<PaginatedData<PostResponseDto>> {
    const { 
      page = 1, 
      limit = 10,  
      date_from, 
      date_to 
    } = queryDto || {};
    
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.status = :status', { status: Status.ACTIVE })
      .andWhere('tag.id = :tagId', { tagId });
  
    if (date_from && date_to) {
      queryBuilder.andWhere('post.created_at BETWEEN :date_from AND :date_to', {
        date_from,
        date_to,
      });
    } else if (date_from) {
      queryBuilder.andWhere('post.created_at >= :date_from', { date_from });
    } else if (date_to) {
      queryBuilder.andWhere('post.created_at <= :date_to', { date_to });
    }
  
    queryBuilder
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    return {
      items: items.map(item => plainToClass(PostResponseDto, item, { 
        excludeExtraneousValues: true,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findByCategoryId(categoryId: string, queryDto?: CategoryPostQueryDto): Promise<PaginatedData<PostResponseDto>> {
    const { 
      page = 1, 
      limit = 10, 
      date_from, 
      date_to 
    } = queryDto || {};
    
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tags')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.status = :status', { status: Status.ACTIVE })
      .andWhere('category.id = :categoryId', { categoryId });
  
    if (date_from && date_to) {
      queryBuilder.andWhere('post.created_at BETWEEN :date_from AND :date_to', {
        date_from,
        date_to,
      });
    } else if (date_from) {
      queryBuilder.andWhere('post.created_at >= :date_from', { date_from });
    } else if (date_to) {
      queryBuilder.andWhere('post.created_at <= :date_to', { date_to });
    }
  
    queryBuilder
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
  
    return {
      items: items.map(item => plainToClass(PostResponseDto, item, { 
        excludeExtraneousValues: true,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findFilteredAndPaginated(
    query: PostQueryDto,
  ): Promise<[PostResponseDto[], number]> {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      author_id,
      date_from,
      date_to,
      category,
      tag,
      type,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags');

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (author_id) {
      queryBuilder.andWhere('user.id = :author_id', { author_id });
    }

    if (date_from) {
      queryBuilder.andWhere('post.created_at >= :date_from', { date_from });
    }

    if (date_to) {
      queryBuilder.andWhere('post.created_at <= :date_to', { date_to });
    }

    if (type) {
      queryBuilder.andWhere('post.post_type = :type', { type });
    }

    queryBuilder.skip(skip).take(limit).orderBy('post.created_at', 'DESC');

    const [posts, total] = await queryBuilder.getManyAndCount();

    let filteredPosts = posts;

    if (category) {
      filteredPosts = filteredPosts.filter((post) =>
        post.categories?.some((cat) => cat.slug === category),
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter((post) =>
        post.tags?.some((tagItem) => tagItem.slug === tag),
      );
    }

    const postDtos = filteredPosts.map((post) =>
      plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }),
    );

    return [postDtos, total];
  }

  async getPostStatistics(): Promise<PostStatisticsDto> {
    const totalPosts = await this.postRepository.count();
    
    const activePosts = await this.postRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    const inactivePosts = await this.postRepository.count({
      where: { status: Status.INACTIVE }
    });
    
    const publishedPosts = await this.postRepository.count({
      where: { status: Status.PUBLISHED }
    });

    // Posts in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const postsLast7Days = await this.postRepository.count({
      where: {
        created_at: MoreThanOrEqual(sevenDaysAgo)
      }
    });

    // Posts in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const postsLast30Days = await this.postRepository.count({
      where: {
        created_at: MoreThanOrEqual(thirtyDaysAgo)
      }
    });

    const avgPostsPerDay = postsLast30Days / 30;

    return {
      total_posts: totalPosts,
      active_posts: activePosts,
      inactive_posts: inactivePosts,
      published_posts: publishedPosts,
      posts_last_7_days: postsLast7Days,
      posts_last_30_days: postsLast30Days,
      avg_posts_per_day: Math.round(avgPostsPerDay * 100) / 100
    };
  }

  async getPostTypeStatistics(): Promise<PostTypeStatisticsResponseDto> {
    const totalPosts = await this.postRepository.count();
    
    const typeStats = await this.postRepository
      .createQueryBuilder('post')
      .select('post.post_type', 'post_type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('post.post_type')
      .getRawMany();

    const byType: PostTypeStatisticsDto[] = Object.values(PostType).map(type => {
      const stat = typeStats.find(s => s.post_type === type);
      const count = stat ? parseInt(stat.count) : 0;
      const percentage = totalPosts > 0 ? Math.round((count / totalPosts) * 10000) / 100 : 0;
      
      return {
        post_type: type,
        count: count,
        percentage: percentage
      };
    });

    return {
      total_posts: totalPosts,
      by_type: byType
    };
  }

  async getPostAuthorStatistics(limit: number = 10): Promise<PostAuthorStatisticsDto[]> {
    const totalPosts = await this.postRepository.count({
      where: { status: Status.ACTIVE }
    });
    
    const authorStats = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .select('user.id', 'author_id')
      .addSelect('user.full_name', 'author_name')
      .addSelect('COUNT(DISTINCT post.id)', 'post_count')
      .where('post.status = :status', { status: Status.ACTIVE })
      .andWhere('user.id IS NOT NULL')
      .groupBy('user.id')
      .addGroupBy('user.full_name')
      .orderBy('COUNT(DISTINCT post.id)', 'DESC')
      .limit(limit)
      .getRawMany();

    return authorStats.map(stat => {
      const postCount = parseInt(stat.post_count);
      const percentage = totalPosts > 0 ? Math.round((postCount / totalPosts) * 10000) / 100 : 0;
      
      return {
        author_id: stat.author_id,
        author_name: stat.author_name || 'Unknown Author',
        post_count: postCount,
        percentage: percentage
      };
    });
  }

  async getMonthlyPostStatistics(year?: number): Promise<MonthlyPostStatisticsDto[]> {
    const currentYear = year || new Date().getFullYear();
    
    const monthlyStats = await this.postRepository
      .createQueryBuilder('post')
      .select('EXTRACT(MONTH FROM post.created_at)', 'month')
      .addSelect('COUNT(*)', 'post_count')
      .where('EXTRACT(YEAR FROM post.created_at) = :year', { year: currentYear })
      .groupBy('EXTRACT(MONTH FROM post.created_at)')
      .orderBy('EXTRACT(MONTH FROM post.created_at)', 'ASC')
      .getRawMany();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const result: MonthlyPostStatisticsDto[] = [];
    for (let month = 1; month <= 12; month++) {
      const stat = monthlyStats.find(s => parseInt(s.month) === month);
      result.push({
        year: currentYear,
        month: month,
        month_name: monthNames[month - 1],
        post_count: stat ? parseInt(stat.post_count) : 0
      });
    }

    return result;
  }

  async getPostTypeDetailedStatistics(postType: PostType): Promise<PostTypeDetailedStatisticsDto> {
    const totalAllPosts = await this.postRepository.count();
    
    // Basic counts for this post type
    const totalPosts = await this.postRepository.count({
      where: { post_type: postType }
    });
    
    const activePosts = await this.postRepository.count({
      where: { 
        post_type: postType,
        status: Status.ACTIVE 
      }
    });
    
    const publishedPosts = await this.postRepository.count({
      where: { 
        post_type: postType,
        status: Status.PUBLISHED 
      }
    });

    // Posts in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const postsLast7Days = await this.postRepository.count({
      where: {
        post_type: postType,
        created_at: MoreThanOrEqual(sevenDaysAgo)
      }
    });

    // Posts in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const postsLast30Days = await this.postRepository.count({
      where: {
        post_type: postType,
        created_at: MoreThanOrEqual(thirtyDaysAgo)
      }
    });

    // Monthly breakdown for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await this.postRepository
      .createQueryBuilder('post')
      .select('EXTRACT(MONTH FROM post.created_at)', 'month')
      .addSelect('COUNT(*)', 'post_count')
      .where('EXTRACT(YEAR FROM post.created_at) = :year', { year: currentYear })
      .andWhere('post.post_type = :postType', { postType })
      .groupBy('EXTRACT(MONTH FROM post.created_at)')
      .orderBy('EXTRACT(MONTH FROM post.created_at)', 'ASC')
      .getRawMany();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyBreakdown: MonthlyPostStatisticsDto[] = [];
    for (let month = 1; month <= 12; month++) {
      const stat = monthlyStats.find(s => parseInt(s.month) === month);
      monthlyBreakdown.push({
        year: currentYear,
        month: month,
        month_name: monthNames[month - 1],
        post_count: stat ? parseInt(stat.post_count) : 0
      });
    }

    const percentage = totalAllPosts > 0 ? Math.round((totalPosts / totalAllPosts) * 10000) / 100 : 0;

    return {
      post_type: postType,
      total_posts: totalPosts,
      active_posts: activePosts,
      published_posts: publishedPosts,
      posts_last_7_days: postsLast7Days,
      posts_last_30_days: postsLast30Days,
      percentage_of_total: percentage,
      monthly_breakdown: monthlyBreakdown
    };
  }

  async uploadFeaturedImage(file: Express.Multer.File) {
    const filePath = await this.storageService.uploadFile({
      bucket: 'akabotdn',
      file: file.buffer,
      fileName: file.originalname,
      fileSize: file.size,
      contentType: file.mimetype,
      scope: 'posts',
    });

    return this.mediaService.create({
      file_name: file.originalname,
      file_path: filePath,
      mime_type: file.mimetype,
      file_size: file.size,
      media_type: MediaType.POST,
    });
  }
}
