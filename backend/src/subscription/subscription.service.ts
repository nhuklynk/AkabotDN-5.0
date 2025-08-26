import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Subscription } from './entity/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionQueryDto } from './dto/subscription-query.dto';
import { PaginationService } from '../common/services/pagination.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    // Check if email already exists
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { email: createSubscriptionDto.email }
    });

    if (existingSubscription) {
      throw new BadRequestException('Email already exists');
    }

    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(query: SubscriptionQueryDto) {
    const { page = 1, limit = 10, fullName, phoneNumber, email, isActive, sortBy, sortOrder } = query;
    
    const whereConditions: FindOptionsWhere<Subscription> = {};
    
    if (fullName) {
      whereConditions.fullName = Like(`%${fullName}%`);
    }
    
    if (phoneNumber) {
      whereConditions.phoneNumber = Like(`%${phoneNumber}%`);
    }
    
    if (email) {
      whereConditions.email = Like(`%${email}%`);
    }
    
    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }

    const orderBy = sortBy || 'created_at';
    const orderDirection = sortOrder || 'DESC';

    const [subscriptions, total] = await this.subscriptionRepository.findAndCount({
      where: whereConditions,
      order: { [orderBy]: orderDirection },
      skip: (page - 1) * limit,
      take: limit,
    });

    return this.paginationService.createPaginatedResponse(
      subscriptions,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id }
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription not found with ID: ${id}`);
    }

    return subscription;
  }

  async findByEmail(email: string): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne({
      where: { email }
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);

    // Check if email is being updated and if it already exists
    if (updateSubscriptionDto.email && updateSubscriptionDto.email !== subscription.email) {
      const existingSubscription = await this.findByEmail(updateSubscriptionDto.email);
      if (existingSubscription) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }

  async toggleActive(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.isActive = !subscription.isActive;
    return await this.subscriptionRepository.save(subscription);
  }

  async getStats() {
    const total = await this.subscriptionRepository.count();
    const active = await this.subscriptionRepository.count({ where: { isActive: true } });
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
    };
  }
}
