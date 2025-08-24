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
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';

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
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
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

    if (createPostDto.category_ids?.length) {
      const categories = await this.categoryRepository.findBy({ id: In(createPostDto.category_ids) });
      post.categories = categories;
    }

    if (createPostDto.tag_ids?.length) {
      const tags = await this.tagRepository.findBy({ id: In(createPostDto.tag_ids) });
      post.tags = tags;
    }

    if (createPostDto.post_status === PostStatus.PUBLISHED) {
      post.published_at = new Date();
    }

    const savedPost = await this.postRepository.save(post);
    return this.findOne(savedPost.id);
  }

  async createWithFormdata(createPostFormdataDto: CreatePostFormdataDto, featuredImage?: any): Promise<PostResponseDto> {
    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostFormdataDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Post with this slug already exists');
    }
    
    const createPostDto: CreatePostDto = {
      ...createPostFormdataDto,
      category_ids: createPostFormdataDto.category_ids ? 
        createPostFormdataDto.category_ids.split(',').map(id => id.trim()) : 
        undefined,
      tag_ids: createPostFormdataDto.tag_ids ? 
        createPostFormdataDto.tag_ids.split(',').map(id => id.trim()) : 
        undefined,
    };
    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      createPostDto.media_id = media.id;
    }

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

  async updateWithFile(id: string, updatePostDto: UpdatePostDto, featuredImage?: any): Promise<PostResponseDto> {
    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      updatePostDto.media_id = media.id;
    }
    return this.update(id, updatePostDto);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['categories', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

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

  async uploadFeaturedImage(featuredImage: any) {
    const filePath = await this.storageService.uploadFile({
      bucket: 'akabotdn',
      file: featuredImage.buffer,
      fileName: featuredImage.originalname,
      fileSize: featuredImage.size,
      contentType: featuredImage.mimetype,
      scope: 'posts'
    });
    const media = await this.mediaService.create({
      file_name: featuredImage.originalname,
      file_path: filePath,
      mime_type: featuredImage.mimetype,
      file_size: featuredImage.size,
      media_type: MediaType.POST,
    });
    return media;
  }
}
