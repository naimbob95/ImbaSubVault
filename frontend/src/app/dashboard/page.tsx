'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/dashboard/subscriptions"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Subscriptions</h3>
                <p className="text-gray-600">View, add, edit, and delete your subscriptions</p>
              </Link>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Monthly Cost</h3>
                <p className="text-2xl font-bold text-blue-600">$0.00</p>
                <p className="text-gray-600 text-sm">Across all subscriptions</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Subscriptions</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-gray-600 text-sm">Currently active</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}