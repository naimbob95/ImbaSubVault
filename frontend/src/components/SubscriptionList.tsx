'use client';

import { useState, useEffect, useCallback } from 'react';
import { Subscription } from '@/types';
import { SubscriptionService } from '@/services/SubscriptionService';
import SubscriptionForm from './SubscriptionForm';

interface SubscriptionListProps {
  onEdit?: (subscription: Subscription) => void;
}

export default function SubscriptionList({ onEdit }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const subscriptionService = SubscriptionService.getInstance();

  
  const loadSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to load subscriptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [subscriptionService]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await subscriptionService.deleteSubscription(id);
      await loadSubscriptions();
    } catch (err) {
      setError('Failed to delete subscription');
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await subscriptionService.toggleSubscriptionStatus(id);
      await loadSubscriptions();
    } catch (err) {
      setError('Failed to toggle subscription status');
      console.error(err);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    loadSubscriptions();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBillingCycleColor = (cycle: string) => {
    const colors = {
      monthly: 'bg-blue-100 text-blue-800',
      yearly: 'bg-green-100 text-green-800',
      weekly: 'bg-purple-100 text-purple-800',
      daily: 'bg-orange-100 text-orange-800',
    };
    return colors[cycle as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Subscriptions</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add Subscription
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white bg-opacity-90 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Create Subscription</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <SubscriptionForm onSuccess={handleCreateSuccess} />
          </div>
        </div>
      )}

      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No subscriptions found. Add your first subscription to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
                  {subscription.description && (
                    <p className="text-sm text-gray-600 mt-1">{subscription.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit?.(subscription)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subscription._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(subscription.cost, subscription.currency)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBillingCycleColor(subscription.billingCycle)}`}>
                    {subscription.billingCycle}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Next payment: {formatDate(subscription.nextPaymentDate)}</p>
                  <p>Started: {formatDate(subscription.startDate)}</p>
                </div>

                {subscription.website && (
                  <a
                    href={subscription.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit website
                  </a>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    subscription.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(subscription._id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {subscription.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}