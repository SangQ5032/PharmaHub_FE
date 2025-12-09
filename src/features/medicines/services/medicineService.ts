import apiClient from '@shared/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
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
  if (!id) {
    throw new Error('Medicine ID is required');
  }
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
  if (!medicineId) {
    throw new Error('Medicine ID is required');
  }
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

// Import thuốc từ file Excel
export interface ImportMedicinesResponse {
  success: boolean;
  message: string;
  data?: {
    total: number;
    success: number;
    failed: number;
    errors?: Array<{
      row: number;
      message: string;
    }>;
  };
}

export async function importMedicines(
  fileUri: string,
  fileName: string,
  fileType: string,
): Promise<ImportMedicinesResponse> {
  const url = '/medicines/import';
  try {
    console.log('[medicineService] POST', url);
    console.log('[medicineService] File info:', {
      uri: fileUri,
      name: fileName,
      type: fileType,
    });

    // Tạo FormData để upload file
    // Format cho React Native: { uri, name, type }
    // LƯU Ý: Phải dùng object literal, không dùng class instance
    const fileData = {
      uri: fileUri,
      name: fileName,
      type:
        fileType ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const formData = new FormData();
    // Field name phải là 'file' để khớp với server multer config
    formData.append('file', fileData as any);

    console.log('[medicineService] FormData created');
    console.log('[medicineService] FormData type:', typeof formData);
    console.log(
      '[medicineService] FormData is FormData:',
      formData instanceof FormData,
    );

    // Sử dụng fetch API trực tiếp thay vì axios để đảm bảo FormData được xử lý đúng
    // Vì axios trong React Native có thể không serialize FormData đúng cách
    const token = await AsyncStorage.getItem('accessToken');

    // Lấy baseURL từ apiClient hoặc tạo trực tiếp
    const baseURL =
      apiClient.defaults.baseURL ||
      (Platform.OS === 'android'
        ? 'http://10.0.2.2:8080/api'
        : 'http://localhost:8080/api');
    const fullUrl = `${baseURL}${url}`;
    console.log('[medicineService] Full URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        Accept: 'application/json',
        // KHÔNG set Content-Type, browser sẽ tự động set multipart/form-data với boundary
      },
      body: formData,
    });

    console.log('[medicineService] Fetch response status:', response.status);
    console.log('[medicineService] Fetch response headers:', response.headers);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[medicineService] Error response:', errorData);

      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Server error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data: ImportMedicinesResponse = await response.json();
    console.log('[medicineService] import success');
    console.log('[medicineService] response:', data);

    return data;
  } catch (err: any) {
    console.error('[medicineService] importMedicines failed');
    console.error('[medicineService] Error message:', err?.message);
    console.error('[medicineService] Error stack:', err?.stack);

    // Nếu đã là Error object, throw lại
    if (err instanceof Error) {
      throw err;
    }

    // Network error hoặc timeout
    throw new Error(
      err?.message ||
        'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
    );
  }
}
