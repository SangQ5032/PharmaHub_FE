// src/features/warehouse/types/inventory.types.ts

/**
 * Thông tin thuốc trong kho
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
  updated_at?: string;
}

/**
 * Thông tin tồn kho của 1 thuốc tại 1 chi nhánh
 */
export interface InventoryItem {
  _id: string;
  branch_id: string;
  branch?: {
    _id: string;
    name: string;
    address: string;
  }; // Populated data
  medicine_id: string;
  medicine?: Medicine; // Populated data
  quantity: number;
  last_updated: string;
  status?: 'normal' | 'low' | 'out_of_stock'; // Trạng thái tồn kho
}

/**
 * Query params để lấy danh sách tồn kho
 */
export interface GetInventoryQuery {
  branch_id?: string;
  medicine_id?: string;
  category?: string;
  status?: 'normal' | 'low' | 'out_of_stock';
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Response từ API GET /api/branches/:id/inventory
 */
export interface GetInventoryResponse {
  success: boolean;
  data: InventoryItem[];
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
  data: InventoryItem;
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
