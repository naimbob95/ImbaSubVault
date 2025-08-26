'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import SubscriptionList from '@/components/SubscriptionList';
import SubscriptionModal from '@/components/SubscriptionModal';
import { useAuth } from '@/contexts/AuthContext';
import { Subscription } from '@/types';

export default function SubscriptionsPage() {
  const { user, logout } = useAuth();
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
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/dashboard" className="text-xl font-semibold text-black">
                  ImbaSubVault
                </Link>
                <div className="flex space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/subscriptions"
                    className="text-blue-600 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Subscriptions
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.firstName || user?.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

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