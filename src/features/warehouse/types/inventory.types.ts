// src/features/warehouse/types/inventory.types.ts

/**
 * Thông tin nhà cung cấp
 */
export interface Supplier {
  _id: string;
  name: string;
}

/**
 * Thông tin lô hàng (batch)
 */
export interface Batch {
  _id: string;
  batch_number: string;
  expiry_date: string;
  import_price: number;
  quantity: number;
  initial_quantity?: number;
  status?: 'active' | 'inactive';
  supplier?: Supplier;
  supplier_id?: string | Supplier;
  supplier_name?: string;
  batch_value?: number;
  imported_at?: string;
  createdAt?: string;
}

/**
 * Thông tin thuốc chi tiết
 */
export interface MedicineDetail {
  _id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  unit?: string;
  category?: string;
  category_id?: string;
  description?: string;
  dosage_form?: string;
  strength?: string;
  retail_price?: number;
  manufacturer?: string;
  country_of_origin?: string;
  registration_number?: string;
  barcode?: string;
  status?: string;
  indications?: string;
  contraindications?: string;
  side_effects?: string;
  usage_instructions?: string;
  storage_conditions?: string;
  warning_threshold?: number;
}

/**
 * Thông tin chi nhánh
 */
export interface Branch {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
}

/**
 * Thuốc với danh sách lô hàng (được dùng khi hiển thị tồn kho)
 */
export interface MedicineWithBatches {
  _id: string;
  medicine: MedicineDetail;
  total_quantity: number;
  batches: Batch[];
}

/**
 * Thông tin tồn kho của 1 thuốc tại 1 chi nhánh (chi tiết)
 */
export interface InventoryDetail {
  _id: string;
  branch?: Branch;
  medicine?: MedicineDetail;
  total_quantity: number;
  warning_threshold?: number;
  status?: 'sufficient' | 'low' | 'low_stock' | 'out_of_stock';
  batches?: Batch[];
  total_value?: number;
  last_updated?: string;
}

/**
 * Thông tin tồn kho của 1 thuốc tại 1 chi nhánh (danh sách)
 */
export interface InventoryItem {
  _id: string;
  branch_id?: string;
  branch?: Branch;
  medicine_id?: string;
  medicine?: MedicineDetail;
  quantity?: number;
  total_quantity?: number;
  last_updated?: string;
  status?: 'sufficient' | 'low' | 'out_of_stock';
  warning_threshold?: number;
  batches?: Batch[];
  total_value?: number;
}

/**
 * Query params để lấy danh sách tồn kho
 */
export interface GetInventoryQuery {
  branch_id?: string;
  medicine_id?: string;
  category?: string;
  status?: 'sufficient' | 'low' | 'out_of_stock';
  low_stock?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * Query params để lấy danh sách batch
 */
export interface GetBatchesQuery {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * Response từ API GET /api/batches/medicines-with-batches/by-branch/:branchId
 */
export interface GetMedicinesWithBatchesResponse {
  success: boolean;
  message: string;
  data: MedicineWithBatches[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response từ API GET /api/batches/branch/:branchId
 */
export interface GetBatchesResponse {
  success: boolean;
  message: string;
  data: Batch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response từ API GET /api/batches/:id
 */
export interface GetBatchDetailResponse {
  success: boolean;
  message: string;
  data: Batch & { medicine_id?: MedicineDetail; branch_id?: Branch };
}

/**
 * Response từ API GET /api/branches/:id/inventory
 */
export interface GetInventoryResponse {
  success: boolean;
  message: string;
  data: InventoryDetail[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response từ API GET /api/inventory/:id
 */
export interface GetInventoryDetailResponse {
  success: boolean;
  message: string;
  data: InventoryDetail;
}

/**
 * Response từ API GET /api/inventory/branch/:branchId/medicine/:medicineId
 */
export interface GetInventoryMedicineDetailResponse {
  success: boolean;
  message: string;
  data: InventoryDetail;
}

/**
 * Response từ API GET /api/inventory/branch/:branchId/medicine/:medicineId/batches
 */
export interface GetBatchesForInvoiceResponse {
  success: boolean;
  message: string;
  data: Batch[];
}

/**
 * Thống kê tồn kho
 */
export interface InventoryStats {
  total_items: number;
  total_medicines: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_value: number;
}

/**
 * Response từ API GET /api/branches/:id/inventory/stats
 */
export interface GetInventoryStatsResponse {
  success: boolean;
  data: InventoryStats;
}
