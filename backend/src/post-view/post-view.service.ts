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
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostViewService {
  constructor(
    @InjectRepository(PostView)
    private readonly postViewRepository: Repository<PostView>,
  ) {}

  async create(createPostViewDto: CreatePostViewDto): Promise<PostViewResponseDto> {
    // Use same timestamp for consistency
    const currentDate = new Date();
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    const postView = await this.postViewRepository.findOne({
      where: {
        post_id: createPostViewDto.post_id,
        view_date: currentDateOnly,
        status: Status.ACTIVE,
      },
    });

    let savedPostView: PostView;
    
    if (postView) {
      postView.view_count++;
      savedPostView = await this.postViewRepository.save(postView);
    } else {
      savedPostView = await this.postViewRepository.save({
        ...createPostViewDto,
        view_date: currentDateOnly,
        view_count: 1,
        status: Status.ACTIVE,
      });
    }

    return plainToClass(PostViewResponseDto, savedPostView, { excludeExtraneousValues: true });
  }

  async findAll(queryDto: PostViewQueryDto): Promise<PaginatedData<PostViewResponseDto>> {
    const { page = 1, limit = 10, post_id, from_date, to_date } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .where('postView.status = :status', { status: Status.ACTIVE });

    if (post_id) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id });
    }

    if (from_date && to_date) {
      queryBuilder.andWhere('postView.view_date BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      });
    } else if (from_date) {
      queryBuilder.andWhere('postView.view_date >= :from_date', { from_date });
    } else if (to_date) {
      queryBuilder.andWhere('postView.view_date <= :to_date', { to_date });
    }

    queryBuilder
      .orderBy('postView.view_date', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const transformedItems = items.map(item => 
      plainToClass(PostViewResponseDto, item, { excludeExtraneousValues: true })
    );

    return {
      items: transformedItems,
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

    return plainToClass(PostViewResponseDto, postView, { excludeExtraneousValues: true });
  }

  async update(id: string, updatePostViewDto: UpdatePostViewDto): Promise<PostViewResponseDto> {
    const postView = await this.postViewRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (!postView) {
      throw new NotFoundException(`Post view with ID ${id} not found`);
    }
    await this.postViewRepository.update(id, updatePostViewDto);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const postView = await this.postViewRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });

    if (!postView) {
      throw new NotFoundException(`Post view with ID ${id} not found`);
    }

    await this.postViewRepository.update(id, { status: Status.INACTIVE });
  }

  async getViewStatistics(queryDto: PostViewQueryDto): Promise<PostViewStatisticsDto[]> {
    const { post_id, from_date, to_date } = queryDto;

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('SUM(postView.view_count)', 'view_count')
      .addSelect('COUNT(DISTINCT DATE(postView.view_date))', 'total_days')
      .addSelect('MIN(postView.view_date)', 'first_view')
      .addSelect('MAX(postView.view_date)', 'latest_view')
      .addSelect('AVG(postView.view_count)', 'avg_daily_views')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .groupBy('postView.post_id')
      .orderBy('SUM(postView.view_count)', 'DESC');

    if (post_id) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id });
    }

    if (from_date && to_date) {
      queryBuilder.andWhere('postView.view_date BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      });
    } else if (from_date) {
      queryBuilder.andWhere('postView.view_date >= :from_date', { from_date });
    } else if (to_date) {
      queryBuilder.andWhere('postView.view_date <= :to_date', { to_date });
    }

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      post_id: result.post_id,
      view_count: parseInt(result.view_count, 10),
      total_days: parseInt(result.total_days, 10),
      avg_daily_views: parseFloat(result.avg_daily_views) || 0,
      first_view: result.first_view,
      latest_view: result.latest_view,
    }));
  }

  async getTotalViews(postId?: string, fromDate?: string, toDate?: string): Promise<number> {
    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('COALESCE(SUM(postView.view_count), 0)', 'total')
      .where('postView.status = :status', { status: Status.ACTIVE });

    if (postId) {
      queryBuilder.andWhere('postView.post_id = :post_id', { post_id: postId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('postView.view_date BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      });
    } else if (fromDate) {
      queryBuilder.andWhere('postView.view_date >= :from_date', { from_date: fromDate });
    } else if (toDate) {
      queryBuilder.andWhere('postView.view_date <= :to_date', { to_date: toDate });
    }

    const result = await queryBuilder.getRawOne();
    return parseInt(result.total, 10) || 0;
  }

  async getViewsByDateRange(fromDate: string, toDate: string): Promise<{ date: string; count: number }[]> {
    if (!fromDate || !toDate) {
      throw new BadRequestException('Both from_date and to_date are required');
    }

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('DATE(postView.view_date)', 'date')
      .addSelect('SUM(postView.view_count)', 'count')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .andWhere('postView.view_date BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      })
      .groupBy('DATE(postView.view_date)')
      .orderBy('DATE(postView.view_date)', 'ASC');

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      date: result.date,
      count: parseInt(result.count, 10) || 0,
    }));
  }

  async getTopViewedPosts(limit: number = 10, fromDate?: string, toDate?: string): Promise<PostViewStatisticsDto[]> {
    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('SUM(postView.view_count)', 'view_count')
      .addSelect('COUNT(DISTINCT DATE(postView.view_date))', 'total_days')
      .addSelect('AVG(postView.view_count)', 'avg_daily_views')
      .addSelect('MIN(postView.view_date)', 'first_view')
      .addSelect('MAX(postView.view_date)', 'latest_view')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .groupBy('postView.post_id')
      .orderBy('SUM(postView.view_count)', 'DESC')
      .limit(limit);

    if (fromDate && toDate) {
      queryBuilder.andWhere('postView.view_date BETWEEN :from_date AND :to_date', {
        from_date: fromDate,
        to_date: toDate,
      });
    } else if (fromDate) {
      queryBuilder.andWhere('postView.view_date >= :from_date', { from_date: fromDate });
    } else if (toDate) {
      queryBuilder.andWhere('postView.view_date <= :to_date', { to_date: toDate });
    }

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      post_id: result.post_id,
      view_count: parseInt(result.view_count, 10),
      total_days: parseInt(result.total_days, 10),
      avg_daily_views: parseFloat(result.avg_daily_views) || 0,
      first_view: result.first_view,
      latest_view: result.latest_view,
    }));
  }

  /**
   * Get trending posts (posts with high recent view growth)
   */
  async getTrendingPosts(days: number = 7, limit: number = 10): Promise<PostViewStatisticsDto[]> {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - days);

    const queryBuilder = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('SUM(postView.view_count)', 'view_count')
      .addSelect('COUNT(DISTINCT DATE(postView.view_date))', 'total_days')
      .addSelect('AVG(postView.view_count)', 'avg_daily_views')
      .addSelect('MIN(postView.view_date)', 'first_view')
      .addSelect('MAX(postView.view_date)', 'latest_view')
      .addSelect(
        `SUM(CASE WHEN postView.view_date >= :recentDate THEN postView.view_count ELSE 0 END)`,
        'recent_views'
      )
      .where('postView.status = :status', { status: Status.ACTIVE })
      .andWhere('postView.view_date >= :pastDate', { pastDate: pastDate.toISOString().split('T')[0] })
      .setParameter('recentDate', new Date(currentDate.getTime() - (days / 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .groupBy('postView.post_id')
      .having('SUM(postView.view_count) > 0')
      .orderBy('recent_views', 'DESC')
      .addOrderBy('SUM(postView.view_count)', 'DESC')
      .limit(limit);

    const results = await queryBuilder.getRawMany();

    return results.map(result => ({
      post_id: result.post_id,
      view_count: parseInt(result.view_count, 10),
      total_days: parseInt(result.total_days, 10),
      avg_daily_views: parseFloat(result.avg_daily_views) || 0,
      first_view: result.first_view,
      latest_view: result.latest_view,
    }));
  }

  /**
   * Get view growth comparison between two periods
   */
  async getViewGrowthComparison(
    currentPeriodStart: string,
    currentPeriodEnd: string,
    previousPeriodStart: string,
    previousPeriodEnd: string
  ): Promise<{ post_id: string; current_views: number; previous_views: number; growth_rate: string }[]> {
    const currentViewsQuery = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('SUM(postView.view_count)', 'current_views')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .andWhere('postView.view_date BETWEEN :currentStart AND :currentEnd', {
        currentStart: currentPeriodStart,
        currentEnd: currentPeriodEnd,
      })
      .groupBy('postView.post_id');

    const previousViewsQuery = this.postViewRepository
      .createQueryBuilder('postView')
      .select('postView.post_id', 'post_id')
      .addSelect('SUM(postView.view_count)', 'previous_views')
      .where('postView.status = :status', { status: Status.ACTIVE })
      .andWhere('postView.view_date BETWEEN :previousStart AND :previousEnd', {
        previousStart: previousPeriodStart,
        previousEnd: previousPeriodEnd,
      })
      .groupBy('postView.post_id');

    const combinedQuery = `
      SELECT 
        COALESCE(current.post_id, previous.post_id) as post_id,
        COALESCE(current.current_views, 0) as current_views,
        COALESCE(previous.previous_views, 0) as previous_views,
        CASE 
          WHEN COALESCE(previous.previous_views, 0) = 0 THEN 
            CASE WHEN COALESCE(current.current_views, 0) > 0 THEN '100.00' ELSE '0.00' END
          ELSE 
            ROUND(((COALESCE(current.current_views, 0) - COALESCE(previous.previous_views, 0)) * 100.0 / previous.previous_views), 2)::text
        END as growth_rate
      FROM (${currentViewsQuery.getQuery()}) current
      FULL OUTER JOIN (${previousViewsQuery.getQuery()}) previous
        ON current.post_id = previous.post_id
      ORDER BY 
        CASE 
          WHEN COALESCE(previous.previous_views, 0) = 0 THEN COALESCE(current.current_views, 0)
          ELSE ((COALESCE(current.current_views, 0) - COALESCE(previous.previous_views, 0)) * 100.0 / previous.previous_views)
        END DESC
    `;

    const results = await this.postViewRepository.query(combinedQuery, [
      Status.ACTIVE,
      currentPeriodStart,
      currentPeriodEnd,
      Status.ACTIVE,
      previousPeriodStart,
      previousPeriodEnd,
    ]);

    return results.map((result: any) => ({
      post_id: result.post_id,
      current_views: parseInt(result.current_views, 10),
      previous_views: parseInt(result.previous_views, 10),
      growth_rate: result.growth_rate,
    }));
  }
}
