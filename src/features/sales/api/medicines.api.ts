import api from '@shared/services/api';

const MEDICINES_ENDPOINT = '/medicines';

export type Medicine = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  price?: number;
  expiry_date?: string;
  supplier_id?: string | { [key: string]: any };
  warning_threshold?: number;
};

export const getMedicines = async (
  limit?: number,
  offset?: number,
): Promise<any> => {
  const response = await api.get<any>(`${MEDICINES_ENDPOINT}`, {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};

export const getMedicineById = async (id: string): Promise<any> => {
  const response = await api.get(`${MEDICINES_ENDPOINT}/${id}`);
  return response.data;
};
