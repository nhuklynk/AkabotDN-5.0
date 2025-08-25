import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { PostView } from './entity/post-view.entity';
import { CreatePostViewDto } from './dto/create-post-view.dto';
import { UpdatePostViewDto } from './dto/update-post-view.dto';
import { PostViewQueryDto } from './dto/post-view-query.dto';
import { PostViewResponseDto, PostViewStatisticsDto } from './dto/post-view-response.dto';
import { PaginatedData } from '../common/interfaces/api-response.interface';
import { Status } from '../config/base-audit.entity';

@Injectable()
export class PostViewService {
  constructor(
    @InjectRepository(PostView)
    private readonly postViewRepository: Repository<PostView>,
  ) {}

  async create(createPostViewDto: CreatePostViewDto): Promise<PostViewResponseDto> {
    const postView = this.postViewRepository.create({
      ...createPostViewDto,
      time: createPostViewDto.time || new Date(),
      status: Status.ACTIVE,
    });

    const savedPostView = await this.postViewRepository.save(postView);
    return this.mapToResponseDto(savedPostView);
  }

  async findAll(queryDto: PostViewQueryDto): Promise<PaginatedData<PostViewResponseDto>> {
    const { page = 1, limit = 10, post_id, from_date, to_date } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .where('postView.status = :status', { status: Status.ACTIVE });

    // Apply filters
    if (post_id) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id });
    }

    if (from_date && to_date) {
      queryBuilder.andWhere('postView.time BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      });
    } else if (from_date) {
      queryBuilder.andWhere('postView.time >= :from_date', { from_date });
    } else if (to_date) {
      queryBuilder.andWhere('postView.time <= :to_date', { to_date });
    }

    // Add pagination and ordering
    queryBuilder
      .orderBy('postView.time', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(item => this.mapToResponseDto(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<PostViewResponseDto> {
    const postView = await this.postViewRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (!postView) {
      throw new NotFoundException(`Post view with ID ${id} not found`);
    }

    return this.mapToResponseDto(postView);
  }

  async update(id: string, updatePostViewDto: UpdatePostViewDto): Promise<PostViewResponseDto> {
    const postView = await this.postViewRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (!postView) {
      throw new NotFoundException(`Post view with ID ${id} not found`);
    }

    // Update the post view
    await this.postViewRepository.update(id, updatePostViewDto);
    
    // Return the updated post view
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const postView = await this.postViewRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (!postView) {
      throw new NotFoundException(`Post view with ID ${id} not found`);
    }

    // Soft delete by updating status
    await this.postViewRepository.update(id, { status: Status.INACTIVE });
  }

  // Statistics methods
  async getViewStatistics(queryDto: PostViewQueryDto): Promise<PostViewStatisticsDto[]> {
    const { post_id, from_date, to_date } = queryDto;

    let queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('COUNT(postView.id)', 'view_count')
      .addSelect('MIN(postView.time)', 'first_view')
      .addSelect('MAX(postView.time)', 'latest_view')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .groupBy('postView.post_id');

    // Apply filters
    if (post_id) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id });
    }

    if (from_date && to_date) {
      queryBuilder.andWhere('postView.time BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      });
    } else if (from_date) {
      queryBuilder.andWhere('postView.time >= :from_date', { from_date });
    } else if (to_date) {
      queryBuilder.andWhere('postView.time <= :to_date', { to_date });
    }

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      post_id: result.post_id,
      view_count: parseInt(result.view_count, 10),
      first_view: result.first_view,
      latest_view: result.latest_view,
    }));
  }

  async getTotalViews(postId?: string, fromDate?: string, toDate?: string): Promise<number> {
    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .where('postView.status = :status', { status: Status.ACTIVE });

    if (postId) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id: postId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('postView.time BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      });
    } else if (fromDate) {
      queryBuilder.andWhere('postView.time >= :from_date', { from_date: fromDate });
    } else if (toDate) {
      queryBuilder.andWhere('postView.time <= :to_date', { to_date: toDate });
    }

    return await queryBuilder.getCount();
  }

  async getViewsByDateRange(fromDate: string, toDate: string): Promise<{ date: string; count: number }[]> {
    if (!fromDate || !toDate) {
      throw new BadRequestException('Both from_date and to_date are required');
    }

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('DATE(postView.time)', 'date')
      .addSelect('COUNT(postView.id)', 'count')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .andWhere('postView.time BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      })
      .groupBy('DATE(postView.time)')
      .orderBy('DATE(postView.time)', 'ASC');

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      date: result.date,
      count: parseInt(result.count, 10),
    }));
  }

  async getTopViewedPosts(limit: number = 10, fromDate?: string, toDate?: string): Promise<PostViewStatisticsDto[]> {
    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('COUNT(postView.id)', 'view_count')
      .addSelect('MIN(postView.time)', 'first_view')
      .addSelect('MAX(postView.time)', 'latest_view')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .groupBy('postView.post_id')
      .orderBy('COUNT(postView.id)', 'DESC')
      .limit(limit);

    if (fromDate && toDate) {
      queryBuilder.andWhere('postView.time BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      });
    } else if (fromDate) {
      queryBuilder.andWhere('postView.time >= :from_date', { from_date: fromDate });
    } else if (toDate) {
      queryBuilder.andWhere('postView.time <= :to_date', { to_date: toDate });
    }

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      post_id: result.post_id,
      view_count: parseInt(result.view_count, 10),
      first_view: result.first_view,
      latest_view: result.latest_view,
    }));
  }

  private mapToResponseDto(postView: PostView): PostViewResponseDto {
    return {
      id: postView.id,
      post_id: postView.post_id,
      time: postView.time,
      status: postView.status,
      created_at: postView.created_at,
      created_by: postView.created_by,
      modified_at: postView.modified_at,
      modified_by: postView.modified_by,
    };
  }
}
