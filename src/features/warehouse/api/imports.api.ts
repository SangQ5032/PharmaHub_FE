// src/features/warehouse/api/imports.api.ts

import apiClient from '@shared/services/api';
import {
  CreateImportBody,
  CreateImportResponse,
  GetImportsQuery,
  GetImportsResponse,
  GetImportDetailResponse,
  UpdateImportStatusBody,
  CancelImportBody,
  GetImportStatsResponse,
} from '@features/warehouse/types/import.types';

export const importsApi = {
  /**
   * Lấy danh sách phiếu nhập hàng
   * Endpoint: GET /api/imports
   * Query params: branch_id, supplier_id, status, from_date, to_date, page, limit
   */
  getImports: async (query?: GetImportsQuery): Promise<GetImportsResponse> => {
    const res = await apiClient.get('/imports', { params: query });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách phiếu nhập');
  },

  /**
   * Lấy chi tiết phiếu nhập hàng
   * Endpoint: GET /api/imports/:id
   */
  getImportDetail: async (id: string): Promise<GetImportDetailResponse> => {
    const res = await apiClient.get(`/imports/${id}`);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy chi tiết phiếu nhập');
  },

  /**
   * Tạo phiếu nhập hàng mới
   * Endpoint: POST /api/imports
   */
  createImport: async (
    body: CreateImportBody,
  ): Promise<CreateImportResponse> => {
    const res = await apiClient.post('/imports', body);

    // Response format: { success: true, data: {...}, message: "..." }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể tạo phiếu nhập');
  },

  /**
   * Cập nhật trạng thái phiếu nhập hàng
   * Endpoint: PATCH /api/imports/:id/status
   */
  updateImportStatus: async (
    id: string,
    body: UpdateImportStatusBody,
  ): Promise<GetImportDetailResponse> => {
    const res = await apiClient.patch(`/imports/${id}/status`, body);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể cập nhật trạng thái phiếu nhập',
    );
  },

  /**
   * Hủy phiếu nhập hàng (Rollback Inventory)
   * Endpoint: POST /api/imports/:id/cancel
   */
  cancelImport: async (
    id: string,
    body: CancelImportBody,
  ): Promise<GetImportDetailResponse> => {
    const res = await apiClient.post(`/imports/${id}/cancel`, body);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể hủy phiếu nhập');
  },

  /**
   * Lấy danh sách Import theo Chi Nhánh
   * Endpoint: GET /api/imports/branch/:branchId
   */
  getImportsByBranch: async (
    branchId: string,
    query?: Omit<GetImportsQuery, 'branch_id'>,
  ): Promise<GetImportsResponse> => {
    const res = await apiClient.get(`/imports/branch/${branchId}`, {
      params: query,
    });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể lấy danh sách phiếu nhập theo chi nhánh',
    );
  },

  /**
   * Lấy thống kê nhập hàng theo chi nhánh
   * Endpoint: GET /api/imports/stats/:branchId
   */
  getImportStats: async (
    branchId: string,
    query?: { from_date?: string; to_date?: string },
  ): Promise<GetImportStatsResponse> => {
    const res = await apiClient.get(`/imports/stats/${branchId}`, {
      params: query,
    });

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data as GetImportStatsResponse;
    }

    throw new Error(res.data.message || 'Không thể lấy thống kê nhập hàng');
  },
};
