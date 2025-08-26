import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { DashboardOverview } from '../interfaces/dashboard-overview.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  public async getOverview(@Request() req): Promise<DashboardOverview> {
    return this.dashboardService.getOverview(req.user.userId);
  }

  @Get('upcoming-payments')
  public async getUpcomingPayments(@Request() req, @Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return this.dashboardService.getUpcomingPayments(req.user.userId, daysNumber);
  }

  @Get('monthly-cost')
  public async getTotalMonthlyCost(@Request() req) {
    const cost = await this.dashboardService.getTotalMonthlyCost(req.user.userId);
    return { totalMonthlyCost: cost };
  }

  @Get('yearly-cost')
  public async getTotalYearlyCost(@Request() req) {
    const cost = await this.dashboardService.getTotalYearlyCost(req.user.userId);
    return { totalYearlyCost: cost };
  }

  @Get('category-counts')
  public async getSubscriptionCountByCategory(@Request() req) {
    return this.dashboardService.getSubscriptionCountByCategory(req.user.userId);
  }

  @Get('active-count')
  public async getActiveSubscriptionsCount(@Request() req) {
    const count = await this.dashboardService.getActiveSubscriptionsCount(req.user.userId);
    return { totalActiveSubscriptions: count };
  }

  @Get('cost-breakdown')
  public async getCostBreakdownByCategory(@Request() req) {
    return this.dashboardService.getCostBreakdownByCategory(req.user.userId);
  }
}