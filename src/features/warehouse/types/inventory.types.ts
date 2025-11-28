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