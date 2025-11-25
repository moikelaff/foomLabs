'use client';

import { useEffect, useState } from 'react';
import { stocksApi } from '@/lib/api';
import { Stock } from '@/lib/types';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function StocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stocksApi.getAll();
      if (response.success && response.data) {
        setStocks(response.data);
      } else {
        setError('Failed to load stocks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: (row: Stock) => (
        <div>
          <div className="font-medium text-gray-900">{row.product.name}</div>
          <div className="text-sm text-gray-500">SKU: {row.product.sku}</div>
        </div>
      ),
    },
    {
      header: 'Warehouse',
      accessor: (row: Stock) => row.warehouse.name,
    },
    {
      header: 'Quantity',
      accessor: (row: Stock) => (
        <span className="font-semibold text-gray-900">{row.quantity}</span>
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
          <h1 className="text-2xl font-semibold text-gray-900">Stock Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            View inventory levels across all warehouses and products.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <div className="mt-8">
        <Table columns={columns} data={stocks} emptyMessage="No stock data available" />
      </div>
    </div>
  );
}
