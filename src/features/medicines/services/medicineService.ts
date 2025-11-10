import apiClient from '@shared/services/api';

// Lấy danh sách medicines
export async function fetchMedicines(): Promise<any[]> {
  const url = '/medicines';
  try {
    // debug: log baseURL + full url
    console.log(
      '[medicineService] API baseURL =',
      (apiClient && (apiClient.defaults as any)?.baseURL) || '<no-baseURL>',
    );
    console.log('[medicineService] GET', url);

    const res = await apiClient.get(url);
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
  } catch (err: any) {
    // detailed logging for debugging
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
