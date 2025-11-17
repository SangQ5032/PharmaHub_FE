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
   * Query params: page, limit, search
   */
  getSuppliers: async (
    query?: GetSuppliersQuery,
  ): Promise<GetSuppliersResponse> => {
    const res = await apiClient.get('/suppliers', { params: query });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách nhà cung cấp');
  },
};
