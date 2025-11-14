// src/features/warehouse/api/imports.api.ts

import apiClient from '@shared/services/api';
import {
  CreateImportBody,
  CreateImportResponse,
  GetImportsQuery,
  GetImportsResponse,
  GetImportDetailResponse,
} from '@features/warehouse/types/import.types';

export const importsApi = {
  /**
   * Lấy danh sách phiếu nhập hàng
   * Endpoint: GET /api/imports
   * Query params: branch_id, supplier_id, from_date, to_date, page, limit
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
   * Lấy thống kê nhập hàng theo chi nhánh
   * Endpoint: GET /api/imports/stats/:branchId
   */
  getImportStats: async (branchId: string): Promise<any> => {
    const res = await apiClient.get(`/imports/stats/${branchId}`);

    // Response format: { success: true, data: {...} }
    if (res.data.success) {
      return res.data.data;
    }

    throw new Error(res.data.message || 'Không thể lấy thống kê nhập hàng');
  },
};
