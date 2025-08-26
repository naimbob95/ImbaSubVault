import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from '../controllers/dashboard.controller';
import { DashboardService } from '../services/dashboard.service';
import { DashboardOverview } from '../interfaces/dashboard-overview.interface';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: jest.Mocked<DashboardService>;

  const mockDashboardService = {
    getOverview: jest.fn(),
    getUpcomingPayments: jest.fn(),
    getTotalMonthlyCost: jest.fn(),
    getTotalYearlyCost: jest.fn(),
    getSubscriptionCountByCategory: jest.fn(),
    getActiveSubscriptionsCount: jest.fn(),
    getCostBreakdownByCategory: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: 'user123',
      email: 'test@example.com',
    },
  };

  const mockOverview: DashboardOverview = {
    totalMonthlyCost: 25.99,
    totalYearlyCost: 311.88,
    subscriptionCountByCategory: { Entertainment: 2, Software: 1 },
    upcomingPayments: [],
    totalActiveSubscriptions: 3,
    averageMonthlyCost: 8.66,
    mostExpensiveSubscription: { name: 'Netflix', cost: 12.99 },
    cheapestSubscription: { name: 'Spotify', cost: 9.99 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get(DashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should return dashboard overview', async () => {
      service.getOverview.mockResolvedValue(mockOverview);

      const result = await controller.getOverview(mockRequest);

      expect(service.getOverview).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockOverview);
    });
  });

  describe('getUpcomingPayments', () => {
    it('should return upcoming payments with default 7 days', async () => {
      const mockPayments = [{ name: 'Netflix', nextPaymentDate: new Date() }];
      service.getUpcomingPayments.mockResolvedValue(mockPayments);

      const result = await controller.getUpcomingPayments(mockRequest);

      expect(service.getUpcomingPayments).toHaveBeenCalledWith('user123', 7);
      expect(result).toEqual(mockPayments);
    });

    it('should return upcoming payments with custom days', async () => {
      const mockPayments = [{ name: 'Netflix', nextPaymentDate: new Date() }];
      service.getUpcomingPayments.mockResolvedValue(mockPayments);

      const result = await controller.getUpcomingPayments(mockRequest, '14');

      expect(service.getUpcomingPayments).toHaveBeenCalledWith('user123', 14);
      expect(result).toEqual(mockPayments);
    });
  });

  describe('getTotalMonthlyCost', () => {
    it('should return total monthly cost', async () => {
      service.getTotalMonthlyCost.mockResolvedValue(25.99);

      const result = await controller.getTotalMonthlyCost(mockRequest);

      expect(service.getTotalMonthlyCost).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ totalMonthlyCost: 25.99 });
    });
  });

  describe('getTotalYearlyCost', () => {
    it('should return total yearly cost', async () => {
      service.getTotalYearlyCost.mockResolvedValue(311.88);

      const result = await controller.getTotalYearlyCost(mockRequest);

      expect(service.getTotalYearlyCost).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ totalYearlyCost: 311.88 });
    });
  });

  describe('getSubscriptionCountByCategory', () => {
    it('should return subscription count by category', async () => {
      const mockCounts = { Entertainment: 2, Software: 1 };
      service.getSubscriptionCountByCategory.mockResolvedValue(mockCounts);

      const result = await controller.getSubscriptionCountByCategory(mockRequest);

      expect(service.getSubscriptionCountByCategory).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockCounts);
    });
  });

  describe('getActiveSubscriptionsCount', () => {
    it('should return active subscriptions count', async () => {
      service.getActiveSubscriptionsCount.mockResolvedValue(3);

      const result = await controller.getActiveSubscriptionsCount(mockRequest);

      expect(service.getActiveSubscriptionsCount).toHaveBeenCalledWith('user123');
      expect(result).toEqual({ totalActiveSubscriptions: 3 });
    });
  });

  describe('getCostBreakdownByCategory', () => {
    it('should return cost breakdown by category', async () => {
      const mockBreakdown = { Entertainment: 22.98, Software: 3.01 };
      service.getCostBreakdownByCategory.mockResolvedValue(mockBreakdown);

      const result = await controller.getCostBreakdownByCategory(mockRequest);

      expect(service.getCostBreakdownByCategory).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockBreakdown);
    });
  });
});