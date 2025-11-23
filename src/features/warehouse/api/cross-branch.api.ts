// src/features/warehouse/api/cross-branch.api.ts

import apiClient from '@shared/services/api';
import {
  CrossBranchInventoryQuery,
  GetCrossBranchInventoryResponse,
  CompareBranchStockResponse,
  AvailableBranchesResponse,
  FindAvailableBranchesQuery,
} from '@features/warehouse/types/cross-branch.types';

export const crossBranchApi = {
  /**
   * Lấy danh sách tồn kho cross-branch (tất cả chi nhánh)
   * Endpoint: GET /api/inventory/cross-branch
   * Query params: medicine_id, branch_id, search, status, sort_by, sort_order, page, limit
   */
  getCrossBranchInventory: async (
    query?: CrossBranchInventoryQuery,
  ): Promise<GetCrossBranchInventoryResponse> => {
    const res = await apiClient.get('/inventory/cross-branch', {
      params: query,
    });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể lấy dữ liệu tồn kho cross-branch',
    );
  },

  /**
   * So sánh tồn kho của 1 thuốc giữa các chi nhánh
   * Endpoint: GET /api/inventory/cross-branch/compare
   * Query params: medicine_id
   */
  compareBranchStock: async (
    medicine_id: string,
  ): Promise<CompareBranchStockResponse> => {
    const res = await apiClient.get('/inventory/cross-branch/compare', {
      params: { medicine_id },
    });

    // Response format: { success: true, data: { medicine: {...}, branches: [...], ... } }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể so sánh tồn kho giữa các chi nhánh',
    );
  },

  /**
   * Tìm chi nhánh có đủ hàng
   * Endpoint: GET /api/inventory/cross-branch/available
   * Query params: medicine_id, quantity
   */
  findAvailableBranches: async (
    params: FindAvailableBranchesQuery,
  ): Promise<AvailableBranchesResponse> => {
    const res = await apiClient.get('/inventory/cross-branch/available', {
      params,
    });

    // Response format: { success: true, data: { medicine_id, quantity_needed, available_branches: [...], ... } }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể tìm chi nhánh có hàng sẵn');
  },
};
