import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Post, PostStatus } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostFormdataDto } from './dto/create-post-formdata.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/category/entity/category.entity';
import { Tag } from 'src/tag/entity/tag.entity';
import { User } from '../user/entity/user.entity';
import { Comment } from '../comment/entity/comment.entity';
import { PostQueryDto } from './dto/post-query.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    // Check if post with slug already exists
    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Post with this slug already exists');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      // user: { id: createPostDto.user_id },
    });

    // Handle categories
    if (createPostDto.category_ids?.length) {
      const categories = await this.categoryRepository.findBy({ id: In(createPostDto.category_ids) });
      post.categories = categories;
    }

    // Handle tags
    if (createPostDto.tag_ids?.length) {
      const tags = await this.tagRepository.findBy({ id: In(createPostDto.tag_ids) });
      post.tags = tags;
    }

    // Set published date if status is published
    if (createPostDto.post_status === PostStatus.PUBLISHED) {
      post.published_at = new Date();
    }

    const savedPost = await this.postRepository.save(post);
    return this.findOne(savedPost.id);
  }

  async createWithFormdata(createPostFormdataDto: CreatePostFormdataDto, featuredImage?: any): Promise<PostResponseDto> {
    // Check if post with slug already exists
    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostFormdataDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Post with this slug already exists');
    }

    // Convert formdata to CreatePostDto format
    const createPostDto: CreatePostDto = {
      ...createPostFormdataDto,
      // Convert comma-separated strings to arrays
      category_ids: createPostFormdataDto.category_ids ? 
        createPostFormdataDto.category_ids.split(',').map(id => id.trim()) : 
        undefined,
      tag_ids: createPostFormdataDto.tag_ids ? 
        createPostFormdataDto.tag_ids.split(',').map(id => id.trim()) : 
        undefined,
    };

    // Handle featured image if provided
    if (featuredImage) {
      // Here you would typically:
      // 1. Save the file to your storage (local disk, cloud storage, etc.)
      // 2. Generate a unique filename
      // 3. Store the file path/URL in the database
      // For now, we'll just log the file info
      console.log('Featured image received:', {
        originalname: featuredImage.originalname,
        mimetype: featuredImage.mimetype,
        size: featuredImage.size
      });
      
      // You can add logic here to save the file and get the path
      // const imagePath = await this.saveImage(featuredImage);
      // createPostDto.primary_media_id = imagePath;
    }

    // Use the existing create method
    return this.create(createPostDto);
  }

  async findAll(query?: PostQueryDto): Promise<PostResponseDto[]> {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags');

    // Apply filters
    if (query?.status) {
      queryBuilder.andWhere('post.post_status = :status', { status: query.status });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    if (query?.author_id) {
      queryBuilder.andWhere('user.id = :author_id', { author_id: query.author_id });
    }

    if (query?.date_from) {
      queryBuilder.andWhere('post.created_at >= :date_from', { date_from: query.date_from });
    }

    if (query?.date_to) {
      queryBuilder.andWhere('post.created_at <= :date_to', { date_to: query.date_to });
    }

    // Apply pagination
    if (query?.page && query?.limit) {
      const skip = (query.page - 1) * query.limit;
      queryBuilder.skip(skip).take(query.limit);
    }

    // Order by created_at desc
    queryBuilder.orderBy('post.created_at', 'DESC');

    const posts = await queryBuilder.getMany();
    
    // Apply category and tag filters after fetching
    let filteredPosts = posts;
    
    if (query?.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.categories?.some(cat => cat.slug === query.category)
      );
    }
    
    if (query?.tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.some(tag => tag.slug === query.tag)
      );
    }
    
    return filteredPosts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }

  async findFilteredAndPaginated(query: PostQueryDto): Promise<[PostResponseDto[], number]> {
    const { page = 1, limit = 10, status, search, author_id, date_from, date_to, category, tag } = query;
    const skip = (page - 1) * limit;

    // Build query builder for search functionality
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags');

    // Add where conditions
    if (status) {
      queryBuilder.andWhere('post.post_status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search)',
        { search: `%${search}%` }
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

    // Add pagination and ordering
    queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('post.created_at', 'DESC');

    const [posts, total] = await queryBuilder.getManyAndCount();

    // Apply category and tag filters after fetching
    let filteredPosts = posts;
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.categories?.some(cat => cat.slug === category)
      );
    }
    
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.some(tagItem => tagItem.slug === tag)
      );
    }

    const postDtos = filteredPosts.map(post => 
      plainToClass(PostResponseDto, post, { excludeExtraneousValues: true })
    );

    return [postDtos, total];
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['user', 'categories', 'tags', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return plainToClass(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { slug: slug },
      relations: ['user', 'categories', 'tags', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return plainToClass(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['categories', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Check if slug is being updated and if it already exists
    if (updatePostDto.slug && updatePostDto.slug !== post.slug) {
      const existingPost = await this.postRepository.findOne({
        where: { slug: updatePostDto.slug },
      });

      if (existingPost) {
        throw new ConflictException('Post with this slug already exists');
      }
    }

    // Handle categories
    if (updatePostDto.category_ids) {
      const categories = await this.categoryRepository.findBy({ id: In(updatePostDto.category_ids) });
      post.categories = categories;
    }

    // Handle tags
    if (updatePostDto.tag_ids) {
      const tags = await this.tagRepository.findBy({ id: In(updatePostDto.tag_ids) });
      post.tags = tags;
    }

    // Set published date if status is being changed to published
    if (updatePostDto.post_status === PostStatus.PUBLISHED && post.post_status !== PostStatus.PUBLISHED) {
      post.published_at = new Date();
    }

    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.remove(post);
  }

  async findByCategory(category_id: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('category.id = :category_id', { category_id })
      .getMany();

    return posts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }

  async findByTag(tag_id: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('tag.id = :tag_id', { tag_id })
      .getMany();

    return posts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }
}
