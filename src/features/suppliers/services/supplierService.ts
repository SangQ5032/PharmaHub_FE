import apiClient from '@shared/services/api';

export async function fetchSuppliers(
  name?: string,
  options?: { page?: number; limit?: number },
) {
  const url = '/suppliers';
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 100;
  const params: Record<string, any> = { page, limit };
  if (name) params.name = name;
  const res = await apiClient.get(url, { params });
  const payload = res.data;
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export async function createSupplier(payload: Record<string, any>) {
  // Chuẩn hóa payload cho cấu trúc nested contact + note
  const body: any = {
    name: payload.name,
    contact: {
      phone: payload.phone ?? payload?.contact?.phone,
      email: payload.email ?? payload?.contact?.email,
      address: payload.address ?? payload?.contact?.address,
    },
    status: payload.status,
    note: payload.note ?? payload.description,
  };
  const res = await apiClient.post('/suppliers', body);
  return res.data;
}

export async function updateSupplier(id: string, payload: Record<string, any>) {
  const body: any = {
    name: payload.name,
    contact: {
      phone: payload.phone ?? payload?.contact?.phone,
      email: payload.email ?? payload?.contact?.email,
      address: payload.address ?? payload?.contact?.address,
    },
    status: payload.status,
    note: payload.note ?? payload.description,
  };
  const res = await apiClient.put(`/suppliers/${id}`, body);
  return res.data;
}

export async function deleteSupplier(id: string) {
  const res = await apiClient.delete(`/suppliers/${id}`);
  return res.data;
}

export async function getSupplier(id: string) {
  const res = await apiClient.get(`/suppliers/${id}`);
  return res.data;
}
