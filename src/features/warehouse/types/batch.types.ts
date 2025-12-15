// src/features/warehouse/types/batch.types.ts

/**
 * Thông tin nhà cung cấp
 */
export interface Supplier {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
}

/**
 * Thông tin chi nhánh
 */
export interface BranchInfo {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
}

/**
 * Cấu trúc đóng gói thuốc (package_structure)
 */
export interface PackageStructure {
  box?: {
    contains: number;
    child: 'blister' | null;
  };
  blister?: {
    contains: number;
    child: 'tablet' | null;
  };
  tablet?: {
    contains: number;
    child: null;
  };
}

/**
 * Giá theo đơn vị
 */
export interface MedicinePrices {
  base_unit_price: number;
  price_per_unit: {
    box?: number;
    blister?: number;
    tablet?: number;
  };
  unit_prices?: {
    box?: number;
    blister?: number;
    tablet?: number;
  };
}

/**
 * Thông tin thuốc
 */
export interface MedicineInfo {
  _id: string;
  name: string;
  unit: string;
  base_unit?: 'tablet' | 'blister' | 'box';
  retail_price?: number;
  generic_name?: string;
  brand_name?: string;
  strength?: string;
  manufacturer?: string;
  category_id?: string;
  package_structure?: PackageStructure;
  prices?: MedicinePrices;
}

/**
 * Lô thuốc
 */
export interface Batch {
  _id: string;
  branch_id?: string | BranchInfo;
  branch?: BranchInfo; // Populated data
  medicine_id?: string | MedicineInfo;
  medicine?: MedicineInfo; // Populated data
  batch_number: string;
  expiry_date: string;
  import_price?: number;
  quantity?: number;
  initial_quantity?: number;
  // Các trường mới từ server - tự động đồng bộ với quantity và initial_quantity
  quantity_in_base_unit?: number;
  initial_quantity_in_base_unit?: number;
  // Giá bán lẻ của lô hàng
  retail_price?: number;
  // Giá bán lẻ cho đơn vị cơ sở (base unit)
  retail_price_for_base_unit?: number;
  // Giá bán lẻ theo từng đơn vị
  retail_price_per_unit?: {
    [key: string]: number;
  };
  supplier_id?: string | Supplier;
  supplier?: Supplier; // Populated data
  status?: 'active' | 'expired' | 'discontinued' | 'sold_out';
  createdAt?: string;
  updatedAt?: string;
  import_record_id?: string;
}

/**
 * Query params để lấy danh sách lô
 */
export interface GetBatchesQuery {
  branch_id?: string;
  medicine_id?: string;
  supplier_id?: string;
  status?: 'active' | 'expired' | 'discontinued' | 'sold_out';
  page?: number;
  limit?: number;
  sort?: 'expiry_date' | '-expiry_date' | 'createdAt' | '-createdAt';
}

/**
 * Response từ API GET /api/batches/branch/:branchId
 */
export interface GetBatchesResponse {
  success: boolean;
  message?: string;
  data: Batch[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Response từ API GET /api/batches/branch/:branchId/medicine/:medicineId
 */
export interface GetBatchesByMedicineResponse {
  success: boolean;
  message?: string;
  data: Batch[];
}

/**
 * Response từ API GET /api/batches/:id
 */
export interface GetBatchDetailResponse {
  success: boolean;
  message?: string;
  data: Batch;
}

/**
 * Response từ API GET /api/batches/medicines-with-batches/by-branch/:branchId
 */
export interface MedicineWithBatches {
  _id: string;
  medicine: MedicineInfo;
  total_quantity: number;
  batches: Batch[];
}

export interface GetMedicinesWithBatchesResponse {
  success: boolean;
  message?: string;
  data: MedicineWithBatches[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Request body để tạo lô mới
 */
export interface CreateBatchBody {
  branch_id: string;
  medicine_id: string;
  batch_number: string;
  expiry_date: string;
  import_price: number;
  quantity: number;
  initial_quantity: number;
  supplier_id: string;
}

/**
 * Response từ API POST /api/batches
 */
export interface CreateBatchResponse {
  success: boolean;
  message?: string;
  data: Batch;
}

/**
 * Request body để cập nhật lô
 */
export interface UpdateBatchBody {
  quantity?: number;
  status?: 'active' | 'expired' | 'discontinued' | 'sold_out';
  import_price?: number;
}

/**
 * Response từ API PUT /api/batches/:id
 */
export interface UpdateBatchResponse {
  success: boolean;
  message?: string;
  data: Batch;
}
