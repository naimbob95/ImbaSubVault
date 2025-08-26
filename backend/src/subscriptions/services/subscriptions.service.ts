import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SubscriptionsRepository } from '../repositories/subscriptions.repository';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';
import { Subscription } from '../schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly subscriptionsRepository: SubscriptionsRepository) {}

  public async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsRepository.create(userId, createSubscriptionDto);
  }

  public async findAllByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findByUserId(userId);
  }

  public async findById(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findByIdAndUserId(id, userId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  public async update(
    id: string,
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const updatedSubscription = await this.subscriptionsRepository.update(
      id,
      userId,
      updateSubscriptionDto,
    );
    if (!updatedSubscription) {
      throw new NotFoundException('Subscription not found');
    }
    return updatedSubscription;
  }

  public async remove(id: string, userId: string): Promise<void> {
    const deletedSubscription = await this.subscriptionsRepository.delete(id, userId);
    if (!deletedSubscription) {
      throw new NotFoundException('Subscription not found');
    }
  }

  public async findByCategory(categoryId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findByCategory(categoryId);
  }

  public async findActiveByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findActiveByUserId(userId);
  }

  public async findUpcomingPayments(userId: string, days: number = 7): Promise<Subscription[]> {
    return this.subscriptionsRepository.findUpcomingPayments(userId, days);
  }

  public async calculateTotalMonthlyCost(userId: string): Promise<number> {
    const subscriptions = await this.subscriptionsRepository.findActiveByUserId(userId);
    return subscriptions.reduce((total, subscription) => {
      switch (subscription.billingCycle) {
        case 'monthly':
          return total + subscription.cost;
        case 'yearly':
          return total + subscription.cost / 12;
        case 'weekly':
          return total + (subscription.cost * 52) / 12;
        case 'daily':
          return total + (subscription.cost * 365) / 12;
        default:
          return total;
      }
    }, 0);
  }

  public async calculateTotalYearlyCost(userId: string): Promise<number> {
    const subscriptions = await this.subscriptionsRepository.findActiveByUserId(userId);
    return subscriptions.reduce((total, subscription) => {
      switch (subscription.billingCycle) {
        case 'monthly':
          return total + subscription.cost * 12;
        case 'yearly':
          return total + subscription.cost;
        case 'weekly':
          return total + subscription.cost * 52;
        case 'daily':
          return total + subscription.cost * 365;
        default:
          return total;
      }
    }, 0);
  }

  public async getSubscriptionCountByCategory(userId: string): Promise<any> {
    const subscriptions = await this.subscriptionsRepository.findActiveByUserId(userId);
    const categoryCounts = {};

    subscriptions.forEach(subscription => {
      const categoryName = (subscription.categoryId as any).name;
      categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    return categoryCounts;
  }
}
