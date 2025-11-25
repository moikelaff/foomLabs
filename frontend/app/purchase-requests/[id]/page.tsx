'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { purchaseRequestsApi } from '@/lib/api';
import { PurchaseRequest } from '@/lib/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

export default function ViewPurchaseRequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  
  const [purchaseRequest, setPurchaseRequest] = useState<PurchaseRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPurchaseRequest();
    }
  }, [id]);

  const loadPurchaseRequest = async () => {
    try {
      setLoading(true);
      const response = await purchaseRequestsApi.getById(id);
      if (response.success && response.data) {
        setPurchaseRequest(response.data);
      } else {
        setError('Purchase request not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'PENDING') => {
    if (!purchaseRequest) return;
    
    if (!confirm(`Change status to ${newStatus}? This will trigger an API call to the external system.`)) {
      return;
    }

    try {
      const response = await purchaseRequestsApi.update(id, { status: newStatus });
      if (response.success && response.data) {
        setPurchaseRequest(response.data);
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!purchaseRequest) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <ErrorMessage message={error || 'Purchase request not found'} />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Purchase Request: {purchaseRequest.reference}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View details and manage purchase request status.
            </p>
          </div>
          <div className="flex gap-2">
            {purchaseRequest.status === 'DRAFT' && (
              <>
                <Link href={`/purchase-requests/${id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button onClick={() => handleStatusUpdate('PENDING')}>
                  Submit to Pending
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={() => router.push('/purchase-requests')}>
              Back to List
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference</label>
            <p className="mt-1 text-sm text-gray-900">{purchaseRequest.reference}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <StatusBadge status={purchaseRequest.status} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse</label>
            <p className="mt-1 text-sm text-gray-900">
              {purchaseRequest.warehouse?.name || '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <p className="mt-1 text-sm text-gray-900">{purchaseRequest.vendor}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created At</label>
            <p className="mt-1 text-sm text-gray-900">
              {purchaseRequest.createdAt
                ? new Date(purchaseRequest.createdAt).toLocaleString()
                : '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Updated At</label>
            <p className="mt-1 text-sm text-gray-900">
              {purchaseRequest.updatedAt
                ? new Date(purchaseRequest.updatedAt).toLocaleString()
                : '-'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchaseRequest.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product?.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
