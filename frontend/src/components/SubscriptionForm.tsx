'use client';

import { useState, useEffect } from 'react';
import { Subscription, CreateSubscriptionData, Category } from '@/types';
import { SubscriptionService } from '@/services/SubscriptionService';
import api from '@/lib/api';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function SubscriptionForm({ subscription, onSuccess, onCancel }: SubscriptionFormProps) {
  const [formData, setFormData] = useState<CreateSubscriptionData>({
    categoryId: '',
    name: '',
    description: '',
    cost: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    website: '',
    notes: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionService = SubscriptionService.getInstance();

  useEffect(() => {
    loadCategories();
    if (subscription) {
      setFormData({
        categoryId: subscription.categoryId,
        name: subscription.name,
        description: subscription.description || '',
        cost: subscription.cost,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        startDate: subscription.startDate.split('T')[0],
        website: subscription.website || '',
        notes: subscription.notes || '',
      });
    }
  }, [subscription]);

  const loadCategories = async () => {
    try {
      const response = await api.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (subscription) {
        await subscriptionService.updateSubscription(subscription._id, formData);
      } else {
        await subscriptionService.createSubscription(formData);
      }
      onSuccess();
    } catch (err) {
      setError(subscription ? 'Failed to update subscription' : 'Failed to create subscription');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-transparent">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          placeholder="Netflix, Spotify, etc."
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
            Cost *
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          >
            <option value="USD">USD</option>
            <option value="MYR">MYR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-1">
          Billing Cycle *
        </label>
        <select
          id="billingCycle"
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          Start Date *
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          placeholder="Optional description..."
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-transparent text-black"
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white border border-blue-600 py-2 px-4 rounded-md text-sm font-medium"
        >
          {loading ? 'Saving...' : (subscription ? 'Update' : 'Create')} Subscription
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}