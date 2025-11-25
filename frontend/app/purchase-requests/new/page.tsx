'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi, warehousesApi, purchaseRequestsApi } from '@/lib/api';
import { Product, Warehouse } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface FormItem {
  product_id: number;
  quantity: number;
}

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    warehouse_id: '',
    vendor: '',
  });

  const [items, setItems] = useState<FormItem[]>([
    { product_id: 0, quantity: 1 },
  ]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, warehousesRes] = await Promise.all([
        productsApi.getAll(),
        warehousesApi.getAll(),
      ]);

      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
      }
      if (warehousesRes.success && warehousesRes.data) {
        setWarehouses(warehousesRes.data);
        if (warehousesRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            warehouse_id: warehousesRes.data[0].id.toString(),
          }));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { product_id: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FormItem, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.vendor.trim()) {
      setError('Vendor name is required');
      return;
    }

    if (items.some((item) => item.product_id === 0)) {
      setError('Please select a product for all items');
      return;
    }

    if (items.some((item) => item.quantity <= 0)) {
      setError('Quantity must be greater than 0 for all items');
      return;
    }

    try {
      setSubmitting(true);
      const response = await purchaseRequestsApi.create({
        warehouse_id: parseInt(formData.warehouse_id),
        vendor: formData.vendor,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      });

      if (response.success) {
        router.push('/purchase-requests');
      } else {
        setError('Failed to create purchase request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create Purchase Request
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Fill in the details below to create a new purchase request.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Select
            label="Warehouse"
            value={formData.warehouse_id}
            onChange={(e) =>
              setFormData({ ...formData, warehouse_id: e.target.value })
            }
            options={[
              { value: '', label: 'Select warehouse' },
              ...warehouses.map((w) => ({ value: w.id, label: w.name })),
            ]}
            required
          />

          <Input
            label="Vendor"
            type="text"
            value={formData.vendor}
            onChange={(e) =>
              setFormData({ ...formData, vendor: e.target.value })
            }
            placeholder="Enter vendor name"
            required
          />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Items</h3>
            <Button type="button" variant="secondary" size="sm" onClick={addItem}>
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Select
                    label={index === 0 ? 'Product' : ''}
                    value={item.product_id}
                    onChange={(e) =>
                      updateItem(index, 'product_id', parseInt(e.target.value))
                    }
                    options={[
                      { value: 0, label: 'Select product' },
                      ...products.map((p) => ({
                        value: p.id,
                        label: `${p.name} (${p.sku})`,
                      })),
                    ]}
                    required
                  />
                </div>
                <div className="w-32">
                  <Input
                    label={index === 0 ? 'Quantity' : ''}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', parseInt(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button type="submit" isLoading={submitting}>
            Create Purchase Request
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/purchase-requests')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
