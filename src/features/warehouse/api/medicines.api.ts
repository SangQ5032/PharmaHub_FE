// src/features/warehouse/api/medicines.api.ts

import apiClient from '@shared/services/api';
import {
  GetMedicinesQuery,
  GetMedicinesResponse,
} from '@features/warehouse/types/medicine.types';

export const medicinesApi = {
  /**
   * Lấy danh sách thuốc
   * Endpoint: GET /api/medicines
   * Query params: page, limit, search, category, supplier_id
   */
  getMedicines: async (
    query?: GetMedicinesQuery,
  ): Promise<GetMedicinesResponse> => {
    const res = await apiClient.get('/medicines', { params: query });

    // Response format: { success: true, data: [...], pagination: {...} }
    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy danh sách thuốc');
  },
};
