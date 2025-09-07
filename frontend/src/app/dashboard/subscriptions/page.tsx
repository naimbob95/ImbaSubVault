'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import SubscriptionList from '@/components/SubscriptionList';
import SubscriptionModal from '@/components/SubscriptionModal';
import { Subscription } from '@/types';

export default function SubscriptionsPage() {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedSubscription(undefined);
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    window.location.reload();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <SubscriptionList onEdit={handleEdit} />
          </div>
        </main>

        <SubscriptionModal
          subscription={selectedSubscription}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}