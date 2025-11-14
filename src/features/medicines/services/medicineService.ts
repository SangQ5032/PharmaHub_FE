import apiClient from '@shared/services/api';

// Lấy danh sách medicines (mặc định backend có thể trả về 10 item do pagination)
// Thêm page & limit để lấy đủ dữ liệu (tạm thời limit lớn để đảm bảo thấy hết)
export async function fetchMedicines(
  name?: string,
  options?: { page?: number; limit?: number },
): Promise<any[]> {
  const url = '/medicines';
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 100; // có 14 record -> 100 đủ dư
  try {
    // debug: log baseURL + full url
    console.log(
      '[medicineService] API baseURL =',
      (apiClient && (apiClient.defaults as any)?.baseURL) || '<no-baseURL>',
    );
    console.log('[medicineService] GET', url, 'params:', { name, page, limit });

    const params: Record<string, any> = { page, limit };
    if (name) params.name = name;

    const res = await apiClient.get(url, { params });
    const payload = res.data;

    // Các format payload khả dụng: array trực tiếp | {data:[]} | {items:[]} | {results:[]}
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    if (payload && Array.isArray(payload.results)) return payload.results;

    // Nếu backend trả về {data:{items:[]}} dạng lồng
    if (payload?.data && Array.isArray(payload.data.items))
      return payload.data.items;

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
