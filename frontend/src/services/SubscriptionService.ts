import api from '@/lib/api';
import { Subscription, CreateSubscriptionData } from '@/types';

export class SubscriptionService {
  private static instance: SubscriptionService;

  private constructor() {}

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  public async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await api.get<Subscription[]>('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      throw error;
    }
  }

  public async getSubscription(id: string): Promise<Subscription> {
    try {
      const response = await api.get<Subscription>(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subscription ${id}:`, error);
      throw error;
    }
  }

  public async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    try {
      const response = await api.post<Subscription>('/subscriptions', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  public async updateSubscription(id: string, data: Partial<CreateSubscriptionData>): Promise<Subscription> {
    try {
      const response = await api.put<Subscription>(`/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update subscription ${id}:`, error);
      throw error;
    }
  }

  public async deleteSubscription(id: string): Promise<void> {
    try {
      await api.delete(`/subscriptions/${id}`);
    } catch (error) {
      console.error(`Failed to delete subscription ${id}:`, error);
      throw error;
    }
  }

  public async toggleSubscriptionStatus(id: string): Promise<Subscription> {
    try {
      const response = await api.patch<Subscription>(`/subscriptions/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error(`Failed to toggle subscription status ${id}:`, error);
      throw error;
    }
  }
}