'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { purchaseRequestsApi } from '@/lib/api';
import { PurchaseRequest } from '@/lib/types';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

export default function PurchaseRequestsPage() {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPurchaseRequests();
  }, []);

  const loadPurchaseRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await purchaseRequestsApi.getAll();
      if (response.success && response.data) {
        setPurchaseRequests(response.data);
      } else {
        setError('Failed to load purchase requests');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purchase request?')) {
      return;
    }

    try {
      const response = await purchaseRequestsApi.delete(id);
      if (response.success) {
        loadPurchaseRequests();
      } else {
        setError('Failed to delete purchase request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const calculateTotalQuantity = (items: PurchaseRequest['items']) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const columns = [
    {
      header: 'Reference',
      accessor: (row: PurchaseRequest) => (
        <span className="font-medium text-blue-600">{row.reference}</span>
      ),
    },
    {
      header: 'Vendor',
      accessor: (row: PurchaseRequest) => row.vendor,
    },
    {
      header: 'Warehouse',
      accessor: (row: PurchaseRequest) => row.warehouse?.name || '-',
    },
    {
      header: 'Total Quantity',
      accessor: (row: PurchaseRequest) => (
        <span className="font-semibold">{calculateTotalQuantity(row.items)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (row: PurchaseRequest) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Created',
      accessor: (row: PurchaseRequest) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
    },
    {
      header: 'Actions',
      accessor: (row: PurchaseRequest) => (
        <div className="flex gap-2">
          <Link href={`/purchase-requests/${row.id}`}>
            <Button size="sm" variant="ghost">
              View
            </Button>
          </Link>
          {row.status === 'DRAFT' && (
            <>
              <Link href={`/purchase-requests/${row.id}/edit`}>
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(row.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Requests</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage purchase requests and track their status from draft to completion.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link href="/purchase-requests/new">
            <Button>Create Purchase Request</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        <Table
          columns={columns}
          data={purchaseRequests}
          emptyMessage="No purchase requests found. Create your first one to get started."
        />
      </div>
    </div>
  );
}
