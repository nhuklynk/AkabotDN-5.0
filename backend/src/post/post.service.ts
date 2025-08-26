import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Post, PostStatus } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostFormdataDto } from './dto/create-post-formdata.dto';
import { UpdatePostFormdataDto } from './dto/update-post-formdata.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/category/entity/category.entity';
import { PostQueryDto } from './dto/post-query.dto';
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';
import { Status } from 'src/config/base-audit.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { Tag } from 'src/tag/entity/tag.entity';
import { UserService } from 'src/user/user.service';

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
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {

    const user = await this.userService.findOne(createPostDto.user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingPost = await this.postRepository.findOne({
      where: { slug: createPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Post with this slug already exists');
    }

    const post = this.postRepository.create({
      ...createPostDto
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
    return plainToClass(PostResponseDto, savedPost, { excludeExtraneousValues: true });
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
      user_id: createPostFormdataDto.user_id,
    };
    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      createPostDto.media_id = media.id;
    }

    return this.create(createPostDto);
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
      relations: ['user', 'categories', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return plainToClass(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { slug: slug },
      relations: ['user', 'categories', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    return plainToClass(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async updateWithFile(id: string, updatePostDto: UpdatePostFormdataDto, featuredImage?: any): Promise<PostResponseDto> {
    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      updatePostDto.media_id = media.id;
    }
    return this.update(id, updatePostDto);
  }

  async update(id: string, updatePostFormdataDto: UpdatePostFormdataDto): Promise<PostResponseDto> {
    const user = await this.userService.findOne(updatePostFormdataDto.user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['categories', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const updatePostDto: UpdatePostDto = {
      ...updatePostFormdataDto,
      title: updatePostFormdataDto.title || post.title,
      content: updatePostFormdataDto.content || post.content,
      post_status: updatePostFormdataDto.post_status || post.post_status,
      summary: updatePostFormdataDto.summary || post.summary,
      published_at: updatePostFormdataDto.published_at ? new Date(updatePostFormdataDto.published_at) : post.published_at,
      media_id: updatePostFormdataDto.media_id || post.media_id,
      category_ids: updatePostFormdataDto.category_ids ? 
        updatePostFormdataDto.category_ids.split(',').map(id => id.trim()) : 
        undefined,
      tag_ids: updatePostFormdataDto.tag_ids ? 
        updatePostFormdataDto.tag_ids.split(',').map(id => id.trim()) : 
        undefined,
      user_id: updatePostFormdataDto.user_id,
    };

    // Set published date if status is being changed to published
    if (updatePostDto.post_status === PostStatus.PUBLISHED && post.post_status !== PostStatus.PUBLISHED) {
      updatePostDto.published_at = new Date();
    }

    const updatedPost = await this.postRepository.update(id, updatePostDto);
    return plainToClass(PostResponseDto, updatedPost, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: id },
    });

    if (post) {
      post.status = Status.INACTIVE;
      await this.postRepository.save(post);
    }
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
