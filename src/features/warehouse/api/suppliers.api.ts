// src/features/warehouse/api/suppliers.api.ts

import apiClient from '@shared/services/api';
import {
  GetSuppliersQuery,
  GetSuppliersResponse,
} from '@features/warehouse/types/supplier.types';

export const suppliersApi = {
  /**
   * Lấy danh sách nhà cung cấp
   * Endpoint: GET /api/suppliers
   * Docs: SUPPLIERS_API_DOCUMENTATION.md
   */
  getSuppliers: async (
    query?: GetSuppliersQuery,
  ): Promise<GetSuppliersResponse> => {
    const res = await apiClient.get('/suppliers', { params: query });

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách nhà cung cấp');
  },

  /**
   * Lấy danh sách nhà cung cấp hoạt động
   * Endpoint: GET /api/suppliers/active
   */
  getActiveSuppliers: async (): Promise<GetSuppliersResponse> => {
    const res = await apiClient.get('/suppliers/active');

    if (res.data.success) {
      return res.data;
    }

    throw new Error(
      res.data.message || 'Không thể lấy danh sách nhà cung cấp hoạt động',
    );
  },
};
