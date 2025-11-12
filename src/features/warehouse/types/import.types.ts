// src/features/warehouse/types/import.types.ts

/**
 * Thông tin nhà cung cấp
 */
export interface Supplier {
  _id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  note?: string;
  created_at: string;
}

/**
 * Thông tin thuốc
 */
export interface Medicine {
  _id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  price: number;
  expiry_date: string;
  supplier_id: string;
  warning_threshold: number;
  created_at: string;
  updated_at: string;
}

/**
 * Chi tiết thuốc trong phiếu nhập
 */
export interface ImportItem {
  medicine_id: string;
  medicine?: Medicine; // Populated data
  quantity: number;
  unit_price: number;
}

/**
 * Phiếu nhập hàng
 */
export interface ImportRecord {
  _id: string;
  branch_id: string;
  branch?: {
    _id: string;
    name: string;
    address: string;
  }; // Populated data
  supplier_id: string;
  supplier?: Supplier; // Populated data
  employee_id: string;
  employee?: {
    _id: string;
    username: string;
    role: string;
  }; // Populated data
  items: ImportItem[];
  total_cost: number;
  created_at: string;
}

/**
 * Request body để tạo phiếu nhập mới
 */
export interface CreateImportBody {
  branch_id: string;
  supplier_id: string;
  items: {
    medicine_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

/**
 * Query params để lấy danh sách phiếu nhập
 */
export interface GetImportsQuery {
  branch_id?: string;
  supplier_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

/**
 * Response từ API GET /api/imports
 */
export interface GetImportsResponse {
  success: boolean;
  data: ImportRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response từ API POST /api/imports
 */
export interface CreateImportResponse {
  success: boolean;
  data: ImportRecord;
  message?: string;
}

/**
 * Response từ API GET /api/imports/:id
 */
export interface GetImportDetailResponse {
  success: boolean;
  data: ImportRecord;
}
