// src/features/warehouse/types/import.types.ts

/**
 * Thông tin chi nhánh (populated)
 */
export interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

/**
 * Thông tin liên hệ nhà cung cấp
 */
export interface SupplierContact {
  phone: string;
  email?: string;
  address?: string;
}

/**
 * Thông tin nhà cung cấp (populated)
 */
export interface Supplier {
  _id: string;
  name: string;
  contact: SupplierContact;
  note?: string;
}

/**
 * Thông tin nhân viên (populated)
 */
export interface Employee {
  _id: string;
  username: string;
  name?: string;
  role?: string;
}

/**
 * Chi tiết thuốc trong phiếu nhập
 */
export interface ImportItem {
  medicine_id: {
    _id: string;
    name: string;
    unit: string;
  };
  quantity: number;
  unit_price: number;
  batch_number: string;
  expiry_date: string;
}

/**
 * Phiếu nhập hàng - Response từ API
 */
export interface ImportRecord {
  _id: string;
  branch_id: Branch;
  supplier_id: Supplier;
  employee_id: Employee;
  items: ImportItem[];
  total_cost: number;
  status: 'pending' | 'completed' | 'cancelled';
  note?: string;
  cancellation_reason?: string;
  createdAt: string;
  updatedAt: string;
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
    batch_number: string;
    expiry_date: string;
  }[];
  note?: string;
}

/**
 * Query params để lấy danh sách phiếu nhập
 */
export interface GetImportsQuery {
  branch_id?: string;
  supplier_id?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

/**
 * Request body để cập nhật trạng thái phiếu nhập
 */
export interface UpdateImportStatusBody {
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * Request body để hủy phiếu nhập
 */
export interface CancelImportBody {
  reason: string;
}

/**
 * Response từ API GET /api/imports/stats/:branchId
 */
export interface GetImportStatsResponse {
  success: boolean;
  data: {
    totalImports: number;
    totalCost: number;
    avgCost: number;
    totalItems: number;
  };
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
  message?: string;
}
