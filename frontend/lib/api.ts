import {
  ApiResponse,
  Product,
  Stock,
  PurchaseRequest,
  Warehouse,
  CreatePurchaseRequestPayload,
  UpdatePurchaseRequestPayload,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.error?.message || 'An error occurred'
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please check your connection.');
  }
}

// Products API
export const productsApi = {
  getAll: () => fetchApi<Product[]>('/products'),
};

// Stocks API
export const stocksApi = {
  getAll: () => fetchApi<Stock[]>('/stocks'),
};

// Warehouses API (extracted from stocks data)
export const warehousesApi = {
  getAll: async (): Promise<ApiResponse<Warehouse[]>> => {
    const stocksResponse = await fetchApi<Stock[]>('/stocks');
    if (stocksResponse.success && stocksResponse.data) {
      const warehouses = stocksResponse.data
        .map((stock) => stock.warehouse)
        .filter(
          (warehouse, index, self) =>
            self.findIndex((w) => w.id === warehouse.id) === index
        );
      return { success: true, data: warehouses };
    }
    return { success: false, data: [] };
  },
};

// Purchase Requests API
export const purchaseRequestsApi = {
  getAll: () => fetchApi<PurchaseRequest[]>('/purchase/request'),

  getById: (id: number) => fetchApi<PurchaseRequest>(`/purchase/request/${id}`),

  create: (data: CreatePurchaseRequestPayload) =>
    fetchApi<PurchaseRequest>('/purchase/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdatePurchaseRequestPayload) =>
    fetchApi<PurchaseRequest>(`/purchase/request/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi<{ message: string }>(`/purchase/request/${id}`, {
      method: 'DELETE',
    }),
};

export { ApiError };
