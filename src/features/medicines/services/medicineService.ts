import apiClient from '@shared/services/api';
import {
  Medicine,
  MedicinesResponse,
  InventoryResponse,
  InventoryAllBranches,
} from '../types';

export interface FetchMedicinesOptions {
  page?: number;
  limit?: number;
  name?: string;
}

export interface FetchMedicinesResult {
  medicines: Medicine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MedicineDetailResponse {
  success: boolean;
  message: string;
  data: Medicine;
}

// Lấy danh sách medicines với pagination
export async function fetchMedicines(
  options: FetchMedicinesOptions = {},
): Promise<FetchMedicinesResult> {
  const url = '/medicines';
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;

  try {
    console.log(
      '[medicineService] API baseURL =',
      (apiClient && (apiClient.defaults as any)?.baseURL) || '<no-baseURL>',
    );
    console.log('[medicineService] GET', url, 'params:', {
      name: options.name,
      page,
      limit,
    });

    const params: Record<string, any> = { page, limit };
    if (options.name) params.name = options.name;

    const res = await apiClient.get<MedicinesResponse>(url, { params });
    const payload = res.data;

    // Response format: {success, message, data: [], pagination: {}}
    if (payload.success && payload.data && payload.pagination) {
      return {
        medicines: payload.data,
        pagination: payload.pagination,
      };
    }

    return {
      medicines: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  } catch (err: any) {
    console.error(
      '[medicineService] fetchMedicines failed message:',
      err?.message ?? err,
    );
    if (err?.response) {
      console.error('[medicineService] response status:', err.response.status);
      console.error('[medicineService] response data:', err.response.data);
    }
    throw err;
  }
}

// Lấy chi tiết thuốc
export async function fetchMedicineDetail(id: string): Promise<Medicine> {
  const url = `/medicines/${id}`;
  try {
    console.log('[medicineService] GET', url);

    const res = await apiClient.get<MedicineDetailResponse>(url);
    const payload = res.data;

    // Response format: {success, message, data: {}}
    if (payload.success && payload.data) {
      return payload.data;
    }

    throw new Error('Invalid response format');
  } catch (err: any) {
    console.error(
      '[medicineService] fetchMedicineDetail failed message:',
      err?.message ?? err,
    );
    if (err?.response) {
      console.error('[medicineService] response status:', err.response.status);
      console.error('[medicineService] response data:', err.response.data);
    }
    throw err;
  }
}

export async function createMedicine(
  payload: Record<string, any>,
): Promise<any> {
  const url = '/medicines';
  try {
    console.log('[medicineService] POST', url, 'payload:', payload);
    const res = await apiClient.post(url, payload);
    console.log('[medicineService] create status:', res.status);
    return res.data;
  } catch (err: any) {
    console.error(
      '[medicineService] createMedicine failed message:',
      err?.message ?? err,
    );
    if (err?.response) {
      console.error('[medicineService] response status:', err.response.status);
      console.error('[medicineService] response data:', err.response.data);
    }
    throw err;
  }
}

// Thêm: cập nhật thuốc (PUT /medicines/:id)
export async function updateMedicine(
  id: string,
  payload: Record<string, any>,
): Promise<any> {
  const res = await apiClient.put(`/medicines/${id}`, payload);
  return res.data;
}

// Thêm: xóa thuốc (DELETE /medicines/:id)
export async function deleteMedicine(id: string): Promise<any> {
  const res = await apiClient.delete(`/medicines/${id}`);
  return res.data;
}

// Lấy tồn kho thuốc tại tất cả chi nhánh
export async function fetchMedicineInventoryAllBranches(
  medicineId: string,
  sortBy: 'branch_name' | 'total_quantity' | 'low_quantity' = 'branch_name',
): Promise<InventoryAllBranches> {
  const url = `/medicines/${medicineId}/inventory-all-branches`;
  try {
    console.log('[medicineService] GET', url, 'sortBy:', sortBy);

    const params: Record<string, any> = { sortBy };

    const res = await apiClient.get<InventoryResponse>(url, { params });
    const payload = res.data;

    // Response format: {success, message, data: {medicine_id, branches: []}}
    if (payload.success && payload.data) {
      return payload.data;
    }

    throw new Error('Invalid response format');
  } catch (err: any) {
    console.error(
      '[medicineService] fetchMedicineInventoryAllBranches failed message:',
      err?.message ?? err,
    );
    if (err?.response) {
      console.error('[medicineService] response status:', err.response.status);
      console.error('[medicineService] response data:', err.response.data);
    }
    throw err;
  }
}
