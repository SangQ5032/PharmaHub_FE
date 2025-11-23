import api from '@shared/services/api';

const MEDICINES_ENDPOINT = '/medicines';
const BATCHES_ENDPOINT = '/batches';

export type Batch = {
  _id: string;
  batch_number: string;
  expiry_date: string;
  import_price: number;
  quantity: number;
  supplier_id: string;
  createdAt: string;
};

export type Medicine = {
  _id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  dosage_form?: string;
  strength?: string;
  unit?: string;
  packaging?: string;
  category_name?: string;
  prescription_required?: boolean;
  is_controlled?: boolean;
  retail_price?: number;
  manufacturer?: string;
  country_of_origin?: string;
  barcode?: string;
  registration_number?: string;
  alert_threshold?: number;
  status?: string;
  description?: string;
  category?: string;
  price?: number;
  expiry_date?: string;
  supplier_id?: string | { [key: string]: any };
  warning_threshold?: number;
  in_stock?: boolean;
  quantity?: number;
  total_quantity?: number;
  batch_count?: number;
  batches?: Batch[];
};

export type GetMedicinesByBranchResponse = {
  success: boolean;
  message: string;
  data: {
    data: Medicine[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export type GetMedicinesWithBatchesResponse = {
  success: boolean;
  message: string;
  data: Medicine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export const getMedicinesByBranch = async (
  branchId: string,
): Promise<Medicine[]> => {
  const response = await api.get<GetMedicinesByBranchResponse>(
    `${MEDICINES_ENDPOINT}/branch/${branchId}`,
  );
  return response.data.data.data;
};

export const getMedicinesWithBatches = async (
  branchId: string,
  page: number = 1,
  limit: number = 10,
  sortParams?: any,
): Promise<GetMedicinesWithBatchesResponse> => {
  const params: any = {
    page,
    limit,
  };

  if (sortParams) {
    params.sort = JSON.stringify(sortParams);
  }

  const response = await api.get<GetMedicinesWithBatchesResponse>(
    `${BATCHES_ENDPOINT}/medicines-with-batches/by-branch/${branchId}`,
    { params },
  );
  return response.data;
};

export const getMedicineById = async (id: string): Promise<any> => {
  const response = await api.get(`${MEDICINES_ENDPOINT}/${id}`);
  return response.data;
};
