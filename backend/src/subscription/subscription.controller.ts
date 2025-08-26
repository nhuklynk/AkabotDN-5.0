import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionQueryDto } from './dto/subscription-query.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new subscription' })
  @ApiResponse({ 
    status: 201, 
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid data or email already exists' })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionService.create(createSubscriptionDto);
    return {
      success: true,
      data: subscription,
      message: 'Subscription created successfully'
    };
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of subscriptions (requires authentication)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of subscriptions',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            items: { type: 'array', items: { $ref: '#/components/schemas/SubscriptionResponseDto' } },
            meta: { type: 'object' }
          }
        },
        message: { type: 'string' }
      }
    }
  })
  async findAll(@Query() query: SubscriptionQueryDto) {
    const result = await this.subscriptionService.findAll(query);
    return {
      success: true,
      data: result,
      message: 'Subscriptions retrieved successfully'
    };
  }

  @Get('stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription statistics (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Subscription statistics' })
  async getStats() {
    const stats = await this.subscriptionService.getStats();
    return {
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully'
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription details by ID (requires authentication)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription details',
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findOne(@Param('id') id: string) {
    const subscription = await this.subscriptionService.findOne(id);
    return {
      success: true,
      data: subscription,
      message: 'Subscription details retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription (requires authentication)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription updated successfully',
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async update(
    @Param('id') id: string, 
    @Body() updateSubscriptionDto: UpdateSubscriptionDto
  ) {
    const subscription = await this.subscriptionService.update(id, updateSubscriptionDto);
    return {
      success: true,
      data: subscription,
      message: 'Subscription updated successfully'
    };
  }

  @Patch(':id/toggle-active')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle subscription active status (requires authentication)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status toggled successfully',
    type: SubscriptionResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async toggleActive(@Param('id') id: string) {
    const subscription = await this.subscriptionService.toggleActive(id);
    return {
      success: true,
      data: subscription,
      message: `Subscription ${subscription.isActive ? 'activated' : 'deactivated'} successfully`
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete subscription (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async remove(@Param('id') id: string) {
    await this.subscriptionService.remove(id);
    return {
      success: true,
      data: null,
      message: 'Subscription deleted successfully'
    };
  }
}
