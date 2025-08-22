import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/category/entity/category.entity';
import { Tag } from 'src/tag/entity/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
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
      user: { id: createPostDto.user_id },
    });

    // Handle categories
    if (createPostDto.category_ids?.length) {
      const categories = await this.categoryRepository.findByIds(createPostDto.category_ids);
      post.categories = categories;
    }

    // Handle tags
    if (createPostDto.tag_ids?.length) {
      const tags = await this.tagRepository.findByIds(createPostDto.tag_ids);
      post.tags = tags;
    }

    // Set published date if status is published
    if (createPostDto.post_status === PostStatus.PUBLISHED) {
      post.published_at = new Date();
    }

    const savedPost = await this.postRepository.save(post);
    return this.findOne(savedPost.id);
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['author', 'primary_media', 'categories', 'tags'],
    });
    return posts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['author', 'primary_media', 'categories', 'tags', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return plainToClass(PostResponseDto, post, { excludeExtraneousValues: true });
  }

  async findBySlug(slug: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { slug: slug },
      relations: ['author', 'primary_media', 'categories', 'tags', 'comments'],
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
      const categories = await this.categoryRepository.findByIds(updatePostDto.category_ids);
      post.categories = categories;
    }

    // Handle tags
    if (updatePostDto.tag_ids) {
      const tags = await this.tagRepository.findByIds(updatePostDto.tag_ids);
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
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.primary_media', 'media')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('category.category_id = :category_id', { category_id })
      .getMany();

    return posts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }

  async findByTag(tag_id: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.primary_media', 'media')
      .leftJoinAndSelect('post.categories', 'categories')
      .where('tag.tag_id = :tag_id', { tag_id })
      .getMany();

    return posts.map(post => plainToClass(PostResponseDto, post, { excludeExtraneousValues: true }));
  }
}
