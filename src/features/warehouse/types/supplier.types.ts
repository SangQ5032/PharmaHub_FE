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
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

/**
 * Response từ API GET /api/suppliers
 */
export interface GetSuppliersResponse {
  success: boolean;
  message: string;
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
 * Tham khảo: SUPPLIERS_API_DOCUMENTATION.md
 */
export interface GetSuppliersQuery {
  page?: number;
  limit?: number;
  q?: string; // Tìm kiếm theo tên, email, hoặc số điện thoại
  status?: 'active' | 'inactive'; // Lọc theo trạng thái
}
