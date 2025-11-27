// src/features/warehouse/api/batches.api.ts

import apiClient from '@shared/services/api';
import {
  GetBatchesQuery,
  GetBatchesResponse,
  GetBatchesByMedicineResponse,
  GetBatchDetailResponse,
  GetMedicinesWithBatchesResponse,
  CreateBatchBody,
  CreateBatchResponse,
  UpdateBatchBody,
  UpdateBatchResponse,
} from '@features/warehouse/types/batch.types';

export const batchesApi = {
  /**
   * Lấy danh sách lô thuốc theo chi nhánh
   * Endpoint: GET /api/batches/branch/:branchId
   * Query params: page, limit, status, sort
   */
  getBatchesByBranch: async (
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
   * Lấy danh sách lô của thuốc cụ thể (sắp xếp theo hạn sử dụng)
   * Endpoint: GET /api/batches/branch/:branchId/medicine/:medicineId
   */
  getBatchesByMedicine: async (
    branchId: string,
    medicineId: string,
  ): Promise<GetBatchesByMedicineResponse> => {
    const res = await apiClient.get(
      `/batches/branch/${branchId}/medicine/${medicineId}`,
    );

    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể lấy danh sách lô theo thuốc',
    );
  },

  /**
   * Lấy chi tiết lô thuốc
   * Endpoint: GET /api/batches/:id
   */
  getBatchDetail: async (id: string): Promise<GetBatchDetailResponse> => {
    const res = await apiClient.get(`/batches/${id}`);

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy chi tiết lô hàng');
  },

  /**
   * Lấy danh sách thuốc + chi tiết lô
   * Endpoint: GET /api/batches/medicines-with-batches/by-branch/:branchId
   * Query params: page, limit
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
   * Tạo lô thuốc mới
   * Endpoint: POST /api/batches
   * Quyền: branch_manager, system_admin
   */
  createBatch: async (body: CreateBatchBody): Promise<CreateBatchResponse> => {
    const res = await apiClient.post('/batches', body);

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể tạo lô hàng');
  },

  /**
   * Cập nhật lô thuốc
   * Endpoint: PUT /api/batches/:id
   * Quyền: branch_manager, system_admin
   */
  updateBatch: async (
    id: string,
    body: UpdateBatchBody,
  ): Promise<UpdateBatchResponse> => {
    const res = await apiClient.put(`/batches/${id}`, body);

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể cập nhật lô hàng');
  },

  /**
   * Xóa lô thuốc
   * Endpoint: DELETE /api/batches/:id
   * Quyền: branch_manager, system_admin
   */
  deleteBatch: async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await apiClient.delete(`/batches/${id}`);

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể xóa lô hàng');
  },
};
