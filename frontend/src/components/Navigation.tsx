'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserDropdown from './UserDropdown';

export default function Navigation() {
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
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
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/dashboard')
                    ? 'text-blue-600 hover:text-blue-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/subscriptions"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveLink('/dashboard/subscriptions')
                    ? 'text-blue-600 hover:text-blue-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Subscriptions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}
