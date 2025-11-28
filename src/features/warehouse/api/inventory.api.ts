// src/features/warehouse/api/inventory.api.ts

import apiClient from '@shared/services/api';
import {
  GetInventoryQuery,
  GetInventoryResponse,
  GetInventoryDetailResponse,
  GetInventoryStatsResponse,
  GetMedicinesWithBatchesResponse,
  GetBatchesResponse,
  GetBatchDetailResponse,
  GetInventoryMedicineDetailResponse,
  GetBatchesForInvoiceResponse,
  GetBatchesQuery,
} from '@features/warehouse/types/inventory.types';

export const inventoryApi = {
  /**
   * API 1: Lấy danh sách thuốc + lô hàng chi tiết (tổng hợp)
   * GET /api/batches/medicines-with-batches/by-branch/:branchId
   */
  getMedicinesWithBatches: async (
    branchId: string,
    query?: GetBatchesQuery,
  ): Promise<GetMedicinesWithBatchesResponse> => {
    const res = await apiClient.get(
      `/batches/medicines-with-batches/by-branch/${branchId}`,
      { params: query },
    );
    if (res.data.success) {
      return res.data;
    }
    throw new Error(
      res.data.message || 'Không thể lấy danh sách thuốc và lô hàng',
    );
  },

  /**
   * API 2: Lấy tất cả lô hàng của chi nhánh
   * GET /api/batches/branch/:branchId
   */
  getAllBatches: async (
    branchId: string,
    query?: GetBatchesQuery,
  ): Promise<GetBatchesResponse> => {
    const res = await apiClient.get(`/batches/branch/${branchId}`, {
      params: query,
    });
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy danh sách lô hàng');
  },

  /**
   * API 3: Lấy lô hàng của thuốc tại chi nhánh
   * GET /api/batches/branch/:branchId/medicine/:medicineId
   */
  getBatchesByMedicine: async (
    branchId: string,
    medicineId: string,
  ): Promise<GetBatchesResponse> => {
    const res = await apiClient.get(
      `/batches/branch/${branchId}/medicine/${medicineId}`,
    );
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy danh sách lô hàng');
  },

  /**
   * API 4: Lấy chi tiết 1 lô hàng
   * GET /api/batches/:id
   */
  getBatchDetail: async (id: string): Promise<GetBatchDetailResponse> => {
    const res = await apiClient.get(`/batches/${id}`);
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy chi tiết lô hàng');
  },

  /**
   * API 5: Lấy tồn kho theo chi nhánh
   * GET /api/branches/:id/inventory
   */
  getInventoryByBranch: async (
    branchId: string,
    query?: GetInventoryQuery,
  ): Promise<GetInventoryResponse> => {
    const res = await apiClient.get(`/branches/${branchId}/inventory`, {
      params: query,
    });
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy danh sách tồn kho');
  },

  /**
   * API 6: Lấy tồn kho của 1 loại thuốc tại chi nhánh (chi tiết)
   * GET /api/inventory/branch/:branchId/medicine/:medicineId
   */
  getInventoryMedicineDetail: async (
    branchId: string,
    medicineId: string,
  ): Promise<GetInventoryMedicineDetailResponse> => {
    const res = await apiClient.get(
      `/inventory/branch/${branchId}/medicine/${medicineId}`,
    );
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy chi tiết tồn kho');
  },

  /**
   * API 7: Lấy danh sách batch cho hóa đơn
   * GET /api/inventory/branch/:branchId/medicine/:medicineId/batches
   */
  getBatchesForInvoice: async (
    branchId: string,
    medicineId: string,
  ): Promise<GetBatchesForInvoiceResponse> => {
    const res = await apiClient.get(
      `/inventory/branch/${branchId}/medicine/${medicineId}/batches`,
    );
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy danh sách lô hàng');
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
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy chi tiết tồn kho');
  },

  /**
   * Lấy tồn kho toàn hệ thống (admin only)
   * GET /api/inventory
   */
  getAllInventory: async (
    query?: GetInventoryQuery,
  ): Promise<GetInventoryResponse> => {
    const res = await apiClient.get('/inventory', { params: query });
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy danh sách tồn kho');
  },

  /**
   * Lấy thống kê tồn kho theo chi nhánh
   * GET /api/branches/:branchId/inventory/stats
   */
  getInventoryStats: async (
    branchId: string,
  ): Promise<GetInventoryStatsResponse> => {
    const res = await apiClient.get(`/branches/${branchId}/inventory/stats`);
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Không thể lấy thống kê tồn kho');
  },
};
