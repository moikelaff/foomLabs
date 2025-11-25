import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Inventory Allocation System
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage your inventory allocation across warehouses with purchase request planning and real-time stock tracking.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/stocks">
            <Button size="lg">View Stock Dashboard</Button>
          </Link>
          <Link href="/purchase-requests">
            <Button variant="secondary" size="lg">
              Manage Purchase Requests
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Stock Management
          </h3>
          <p className="text-gray-600">
            Track inventory levels across all warehouses with real-time updates and comprehensive product information.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Purchase Requests
          </h3>
          <p className="text-gray-600">
            Create and manage purchase requests with automated stock allocation upon delivery confirmation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-blue-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Webhook Integration
          </h3>
          <p className="text-gray-600">
            Seamless integration with supplier systems for automated stock updates and allocation.
          </p>
        </div>
      </div>
    </div>
  );
}
