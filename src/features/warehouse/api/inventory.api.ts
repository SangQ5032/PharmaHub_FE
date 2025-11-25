// src/features/warehouse/api/inventory.api.ts

import apiClient from '@shared/services/api';
import {
  GetInventoryQuery,
  GetInventoryResponse,
  GetInventoryDetailResponse,
  GetInventoryStatsResponse,
} from '@features/warehouse/types/inventory.types';

export const inventoryApi = {
  /**
   * Lấy danh sách tồn kho theo chi nhánh
   * Endpoint: GET /api/branches/:branchId/inventory
   * Query params: category, status, search, page, limit
   */
  getInventoryByBranch: async (
    branchId: string,
    query?: GetInventoryQuery,
  ): Promise<GetInventoryResponse> => {
    const res = await apiClient.get(`/branches/${branchId}/inventory`, {
      params: query,
    });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách tồn kho');
  },

  /**
   * Lấy tồn kho toàn hệ thống (admin only)
   * Endpoint: GET /api/inventory
   * Query params: branch_id, medicine_id, category, status, search, page, limit
   */
  getAllInventory: async (
    query?: GetInventoryQuery,
  ): Promise<GetInventoryResponse> => {
    const res = await apiClient.get('/inventory', { params: query });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách tồn kho');
  },

  /**
   * Lấy tồn kho của 1 loại thuốc tại chi nhánh cụ thể
   * Endpoint: GET /api/inventory/branch/:branchId/medicine/:medicineId
   */
  getInventoryByBranchAndMedicine: async (
    branchId: string,
    medicineId: string,
  ): Promise<GetInventoryDetailResponse> => {
    const res = await apiClient.get(
      `/inventory/branch/${branchId}/medicine/${medicineId}`,
    );

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể lấy tồn kho thuốc tại chi nhánh',
    );
  },

  /**
   * Lấy chi tiết tồn kho bằng Inventory ID
   * Endpoint: GET /api/inventory/:inventoryId
   */
  getInventoryDetail: async (
    id: string,
  ): Promise<GetInventoryDetailResponse> => {
    const res = await apiClient.get(`/inventory/${id}`);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy chi tiết tồn kho');
  },

  /**
   * Lấy thống kê tồn kho theo chi nhánh
   * Endpoint: GET /api/branches/:branchId/inventory/stats
   */
  getInventoryStats: async (
    branchId: string,
  ): Promise<GetInventoryStatsResponse> => {
    const res = await apiClient.get(`/branches/${branchId}/inventory/stats`);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy thống kê tồn kho');
  },
};
