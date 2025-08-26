'use client';

import { Subscription } from '@/types';
import SubscriptionForm from './SubscriptionForm';

interface SubscriptionModalProps {
  subscription?: Subscription;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionModal({ subscription, isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent  bg-opacity-10 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-transparent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-black">
            {subscription ? 'Edit Subscription' : 'Create Subscription'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        <SubscriptionForm
          subscription={subscription}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}