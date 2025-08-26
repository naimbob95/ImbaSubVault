export interface DashboardOverview {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  subscriptionCountByCategory: Record<string, number>;
  upcomingPayments: any[];
  totalActiveSubscriptions: number;
  averageMonthlyCost: number;
  mostExpensiveSubscription: any;
  cheapestSubscription: any;
}