// src/features/warehouse/types/cross-branch.types.ts

/**
 * Thông tin tồn kho của 1 chi nhánh
 */
export interface BranchStock {
  branch_id: string;
  branch_name: string;
  quantity: number;
  status: 'normal' | 'low' | 'out_of_stock';
}

/**
 * Tồn kho cross-branch của 1 thuốc
 * Hiển thị tồn kho của 1 loại thuốc tại tất cả các chi nhánh
 */
export interface CrossBranchInventoryItem {
  medicine_id: string;
  medicine_name: string;
  category: string;
  unit: string;
  branches: BranchStock[]; // Danh sách chi nhánh và số lượng tồn
  total_quantity: number; // Tổng tồn kho tất cả chi nhánh
  max_quantity: number; // Số lượng tồn nhiều nhất (của 1 chi nhánh)
  min_quantity: number; // Số lượng tồn ít nhất (của 1 chi nhánh)
  difference: number; // Chênh lệch: max - min
}

/**
 * Response từ API GET /api/inventory/cross-branch
 */
export interface GetCrossBranchInventoryResponse {
  success: boolean;
  data: CrossBranchInventoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query params cho API GET /api/inventory/cross-branch
 */
export interface CrossBranchInventoryQuery {
  medicine_id?: string; // Filter theo thuốc cụ thể
  branch_id?: string; // Filter theo chi nhánh cụ thể
  page?: number;
  limit?: number;
  search?: string; // Tìm kiếm theo tên thuốc
  status?: 'all_in_stock' | 'some_out_of_stock' | 'all_out_of_stock'; // Filter theo trạng thái
  sort_by?: 'total_quantity' | 'medicine_name' | 'difference'; // Sắp xếp
  sort_order?: 'asc' | 'desc';
}

/**
 * Response từ API GET /api/inventory/cross-branch/compare
 * So sánh tồn kho của 1 thuốc giữa các chi nhánh
 */
export interface CompareBranchStockResponse {
  success: boolean;
  data: {
    medicine: {
      _id: string;
      name: string;
      category: string;
      unit: string;
      price: number;
      description?: string;
    };
    branches: BranchStock[];
    total_quantity: number;
    max_quantity: number;
    min_quantity: number;
    difference: number;
  };
}

/**
 * Response từ API GET /api/inventory/cross-branch/available
 * Tìm chi nhánh có đủ hàng
 */
export interface AvailableBranchesResponse {
  success: boolean;
  data: {
    medicine_id: string;
    medicine_name: string;
    quantity_needed: number;
    available_branches: BranchStock[]; // Danh sách chi nhánh có đủ hàng
    unavailable_branches: BranchStock[]; // Danh sách chi nhánh không đủ hàng
  };
}

/**
 * Query params cho API GET /api/inventory/cross-branch/available
 */
export interface FindAvailableBranchesQuery {
  medicine_id: string;
  quantity: number;
}
