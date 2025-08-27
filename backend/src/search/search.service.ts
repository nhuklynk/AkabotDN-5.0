import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Brackets } from 'typeorm';
import { Post } from '../post/entity/post.entity';
import { Event } from '../event/entity/event.entity';
import { Tag } from '../tag/entity/tag.entity';
import { Category } from '../category/entity/category.entity';
import { Partner } from '../partner/entity/partner.entity';
import { Faq } from '../faq/entity/faq.entity';
import { Status } from '../config/base-audit.entity';

export interface SearchResult {
  posts: Post[];
  events: Event[];
  faqs: Faq[];
  partners: Partner[];
  pagination: {
    posts: { page: number; limit: number; total: number; totalPages: number };
    events: { page: number; limit: number; total: number; totalPages: number };
    faqs: { page: number; limit: number; total: number; totalPages: number };
    partners: { page: number; limit: number; total: number; totalPages: number };
  };
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  async searchAll(
    query: string, 
    options: {
      posts?: { page: number; limit: number };
      events?: { page: number; limit: number };
      faqs?: { page: number; limit: number };
      partners?: { page: number; limit: number };
    } = {}
  ): Promise<SearchResult> {
    const searchTerm = `%${query}%`;
    
    // Default pagination options
    const defaultPagination = { page: 1, limit: 10 };
    const postsOpt = options.posts || defaultPagination;
    const eventsOpt = options.events || defaultPagination;
    const faqsOpt = options.faqs || defaultPagination;
    const partnersOpt = options.partners || defaultPagination;
    
    const [matchingTags, matchingCategories] = await Promise.all([
      this.tagRepository.find({
        where: [
          { name: Like(searchTerm) },
          { slug: Like(searchTerm) },
          { description: Like(searchTerm) },
        ],
      }),
      this.categoryRepository.find({
        where: [
          { name: Like(searchTerm) },
          { slug: Like(searchTerm) },
          { description: Like(searchTerm) },
        ],
      }),
    ]);

    const tagIds = matchingTags.map(tag => tag.id);
    const categoryIds = matchingCategories.map(category => category.id);

    const [posts, events, faqs, partners] = await Promise.all([
      this.searchPosts(searchTerm, tagIds, categoryIds, postsOpt),
      this.searchEvents(searchTerm, tagIds, categoryIds, eventsOpt),
      this.searchFAQs(searchTerm, faqsOpt),
      this.searchPartners(searchTerm, partnersOpt),
    ]);

    return {
      posts: posts.data,
      events: events.data,
      faqs: faqs.data,
      partners: partners.data,
      pagination: {
        posts: posts.pagination,
        events: events.pagination,
        faqs: faqs.pagination,
        partners: partners.pagination,
      },
    };
  }

  private async searchPosts(
    searchTerm: string,
    tagIds: string[],
    categoryIds: string[],
    options: { page: number; limit: number }
  ): Promise<{ data: Post[]; pagination: any }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .leftJoinAndSelect('post.categories', 'categories')
        .leftJoinAndSelect('post.tags', 'tags')
        .where('post.status = :status', { status: Status.PUBLISHED })
        .andWhere(
            new Brackets((qb) => {
            qb.where('post.title LIKE :searchTerm', { searchTerm })
                .orWhere('post.content LIKE :searchTerm', { searchTerm })
                .orWhere('post.summary LIKE :searchTerm', { searchTerm });

            if (tagIds.length > 0) {
                qb.orWhere('tags.id IN (:...tagIds)', { tagIds });
            }

            if (categoryIds.length > 0) {
                qb.orWhere('categories.id IN (:...categoryIds)', { categoryIds });
            }
        }),
    );

    const [data, total] = await queryBuilder
      .orderBy('post.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async searchEvents(
    searchTerm: string,
    tagIds: string[],
    categoryIds: string[],
    options: { page: number; limit: number }
  ): Promise<{ data: Event[]; pagination: any }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.categories', 'categories')
        .leftJoinAndSelect('event.tags', 'tags')
        .where('event.status = :status', { status: Status.ACTIVE })
        .andWhere(
            new Brackets((qb) => {
            qb.where('event.title LIKE :searchTerm', { searchTerm })
                .orWhere('event.description LIKE :searchTerm', { searchTerm })
                .orWhere('event.location LIKE :searchTerm', { searchTerm });

            if (tagIds.length > 0) {
                qb.orWhere('tags.id IN (:...tagIds)', { tagIds });
            }

            if (categoryIds.length > 0) {
                qb.orWhere('categories.id IN (:...categoryIds)', { categoryIds });
            }
            }),
        );

    const [data, total] = await queryBuilder
      .orderBy('event.start_time', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async searchFAQs(
    searchTerm: string, 
    options: { page: number; limit: number }
  ): Promise<{ data: Faq[]; pagination: any }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.faqRepository.findAndCount({
      where: [
        { content: Like(searchTerm), status: Status.ACTIVE },
      ],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async searchPartners(
    searchTerm: string, 
    options: { page: number; limit: number }
  ): Promise<{ data: Partner[]; pagination: any }> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.partnerRepository.findAndCount({
      where: [
        { name: Like(searchTerm), status: Status.ACTIVE },
        { description: Like(searchTerm), status: Status.ACTIVE },
        { website: Like(searchTerm), status: Status.ACTIVE },
      ],
      order: { sort_order: 'ASC', created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}