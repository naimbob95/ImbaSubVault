export interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  name: string;
  description?: string;
  cost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  startDate: string;
  nextPaymentDate: string;
  isActive: boolean;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOverview {
  totalMonthlyCost: number;
  totalYearlyCost: number;
  totalSubscriptions: number;
  subscriptionsByCategory: Array<{
    category: string;
    count: number;
    totalCost: number;
  }>;
  upcomingPayments: Subscription[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateSubscriptionData {
  categoryId: string;
  name: string;
  description?: string;
  cost: number;
  currency?: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  startDate: string;
  website?: string;
  notes?: string;
}