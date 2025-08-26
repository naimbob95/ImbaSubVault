import { Injectable } from '@nestjs/common';
import { SubscriptionsService } from '../../subscriptions/services/subscriptions.service';
import { DashboardOverview } from '../interfaces/dashboard-overview.interface';

@Injectable()
export class DashboardService {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  public async getOverview(userId: string): Promise<DashboardOverview> {
    const [
      totalMonthlyCost,
      totalYearlyCost,
      subscriptionCountByCategory,
      upcomingPayments,
      activeSubscriptions,
    ] = await Promise.all([
      this.subscriptionsService.calculateTotalMonthlyCost(userId),
      this.subscriptionsService.calculateTotalYearlyCost(userId),
      this.subscriptionsService.getSubscriptionCountByCategory(userId),
      this.subscriptionsService.findUpcomingPayments(userId, 7),
      this.subscriptionsService.findActiveByUser(userId),
    ]);

    const totalActiveSubscriptions = activeSubscriptions.length;
    const averageMonthlyCost = totalActiveSubscriptions > 0 ? totalMonthlyCost / totalActiveSubscriptions : 0;

    let mostExpensiveSubscription: any = null;
    let cheapestSubscription: any = null;

    if (activeSubscriptions.length > 0) {
      const subscriptionsWithMonthlyCost = activeSubscriptions.map(sub => ({
        ...sub,
        monthlyCost: this.calculateMonthlyCost(sub.cost, sub.billingCycle),
      }));

      mostExpensiveSubscription = subscriptionsWithMonthlyCost.reduce((max, sub) =>
        sub.monthlyCost > max.monthlyCost ? sub : max
      );

      cheapestSubscription = subscriptionsWithMonthlyCost.reduce((min, sub) =>
        sub.monthlyCost < min.monthlyCost ? sub : min
      );
    }

    return {
      totalMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      totalYearlyCost: Math.round(totalYearlyCost * 100) / 100,
      subscriptionCountByCategory,
      upcomingPayments,
      totalActiveSubscriptions,
      averageMonthlyCost: Math.round(averageMonthlyCost * 100) / 100,
      mostExpensiveSubscription,
      cheapestSubscription,
    };
  }

  public async getUpcomingPayments(userId: string, days: number = 7): Promise<any[]> {
    return this.subscriptionsService.findUpcomingPayments(userId, days);
  }

  public async getTotalMonthlyCost(userId: string): Promise<number> {
    const cost = await this.subscriptionsService.calculateTotalMonthlyCost(userId);
    return Math.round(cost * 100) / 100;
  }

  public async getTotalYearlyCost(userId: string): Promise<number> {
    const cost = await this.subscriptionsService.calculateTotalYearlyCost(userId);
    return Math.round(cost * 100) / 100;
  }

  public async getSubscriptionCountByCategory(userId: string): Promise<Record<string, number>> {
    return this.subscriptionsService.getSubscriptionCountByCategory(userId);
  }

  public async getActiveSubscriptionsCount(userId: string): Promise<number> {
    const activeSubscriptions = await this.subscriptionsService.findActiveByUser(userId);
    return activeSubscriptions.length;
  }

  public async getCostBreakdownByCategory(userId: string): Promise<Record<string, number>> {
    const activeSubscriptions = await this.subscriptionsService.findActiveByUser(userId);
    const categoryBreakdown: Record<string, number> = {};

    activeSubscriptions.forEach(subscription => {
      const categoryName = (subscription.categoryId as any).name;
      const monthlyCost = this.calculateMonthlyCost(subscription.cost, subscription.billingCycle);
      
      if (categoryBreakdown[categoryName]) {
        categoryBreakdown[categoryName] += monthlyCost;
      } else {
        categoryBreakdown[categoryName] = monthlyCost;
      }
    });

    Object.keys(categoryBreakdown).forEach(key => {
      categoryBreakdown[key] = Math.round(categoryBreakdown[key] * 100) / 100;
    });

    return categoryBreakdown;
  }

  private calculateMonthlyCost(cost: number, billingCycle: string): number {
    switch (billingCycle) {
      case 'monthly':
        return cost;
      case 'yearly':
        return cost / 12;
      case 'weekly':
        return (cost * 52) / 12;
      case 'daily':
        return (cost * 365) / 12;
      default:
        return 0;
    }
  }
}