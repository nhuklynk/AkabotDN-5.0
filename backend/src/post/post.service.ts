import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post, PostStatus } from './entity/post.entity';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/category/entity/category.entity';
import { PostQueryDto } from './dto/post-query.dto';
import { StorageService } from 'src/storage';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/entity/media.entity';
import { Status } from 'src/config/base-audit.entity';
import { Tag } from 'src/tag/entity/tag.entity';
import { UserService } from 'src/user/user.service';
import { CreatePostFormdataDto } from './dto/create-post.dto';
import { UpdatePostFormdataDto } from './dto/update-post-formdata.dto';
import { PostViewService } from 'src/post-view/post-view.service';

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
      post_status: createPostDto.post_status,
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

    if (createPostDto.post_status === PostStatus.PUBLISHED) {
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

    if (
      updatePostDto.post_status === PostStatus.PUBLISHED &&
      post.post_status !== PostStatus.PUBLISHED
    ) {
      post.published_at = new Date();
    }

    if (featuredImage) {
      const media = await this.uploadFeaturedImage(featuredImage);
      post.media_id = media.id;
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
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags');

    if (status) {
      queryBuilder.andWhere('post.post_status = :status', { status });
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
