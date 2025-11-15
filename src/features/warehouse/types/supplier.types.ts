// src/features/warehouse/types/supplier.types.ts

/**
 * Thông tin liên hệ nhà cung cấp
 */
export interface SupplierContact {
  phone: string;
  email: string;
  address: string;
}

/**
 * Nhà cung cấp
 */
export interface Supplier {
  _id: string;
  name: string;
  contact: SupplierContact;
  note?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Response từ API GET /api/suppliers
 */
export interface GetSuppliersResponse {
  success: boolean;
  data: Supplier[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query params để lấy danh sách nhà cung cấp
 */
export interface GetSuppliersQuery {
  page?: number;
  limit?: number;
  search?: string;
}
