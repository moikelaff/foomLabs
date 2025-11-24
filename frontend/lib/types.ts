// Type definitions for API responses

export interface Product {
  id: number;
  name: string;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stock {
  id: number;
  warehouse_id: number;
  product_id: number;
  quantity: number;
  warehouse: Warehouse;
  product: Product;
}

export interface PurchaseRequestItem {
  id?: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface PurchaseRequest {
  id: number;
  reference: string;
  warehouse_id: number;
  vendor: string;
  status: 'DRAFT' | 'PENDING' | 'COMPLETED';
  warehouse?: Warehouse;
  items: PurchaseRequestItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface CreatePurchaseRequestPayload {
  warehouse_id: number;
  vendor: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface UpdatePurchaseRequestPayload {
  warehouse_id?: number;
  vendor?: string;
  status?: 'DRAFT' | 'PENDING' | 'COMPLETED';
  items?: {
    product_id: number;
    quantity: number;
  }[];
}
