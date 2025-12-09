import api from '@shared/services/api';

const MEDICINES_ENDPOINT = '/medicines';
const BATCHES_ENDPOINT = '/batches';

export type Batch = {
  _id: string;
  batch_number: string;
  batch_code?: string; // Hỗ trợ cả batch_code từ API
  expiry_date: string;
  import_price: number;
  retail_price?: number; // Giá bán lẻ của lô hàng
  quantity: number;
  supplier_id?: string;
  supplier_name?: string;
  createdAt: string;
};

// PackageStructure linh hoạt - hỗ trợ bất kỳ đơn vị nào
export type PackageStructure = {
  [key: string]: {
    contains: number;
    child: string | null;
  };
};

// MedicinePrices linh hoạt - hỗ trợ bất kỳ đơn vị nào
export type MedicinePrices = {
  base_unit_price: number;
  price_per_unit: {
    [key: string]: number | null | undefined;
  };
  unit_prices?: {
    [key: string]: number | null | undefined;
  };
};

export type Medicine = {
  _id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  dosage_form?: string;
  strength?: string;
  base_unit?: string;
  unit?: string;
  packaging?: string;
  category_name?: string;
  category_id?: string;
  prescription_required?: boolean;
  is_controlled?: boolean;
  package_structure?: PackageStructure;
  prices?: MedicinePrices;
  retail_price?: number;
  minimum_price?: number;
  max_price?: number;
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
  indications?: string;
  contraindications?: string;
  side_effects?: string;
  usage_instructions?: string;
  storage_conditions?: string;
  // Legacy field for backward compatibility - sẽ được chuyển đổi từ prices
  units?: Array<{
    unit: string;
    multiplier: number;
    price: number;
  }>;
};

export type MedicineWithBatches = {
  _id: string;
  medicine: Medicine;
  total_quantity: number;
  batches: Batch[];
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

  const response = await api.get<{
    success: boolean;
    message: string;
    data: MedicineWithBatches[];
    pagination: any;
  }>(`${BATCHES_ENDPOINT}/medicines-with-batches/by-branch/${branchId}`, {
    params,
  });

  // Transform the response to ensure flat structure for medicines
  const rawData = response.data.data as MedicineWithBatches[];
  const transformedData = rawData.map((item: MedicineWithBatches) => ({
    ...item.medicine,
    total_quantity: item.total_quantity,
    batches: item.batches,
    batch_count: item.batches?.length || 0,
  }));

  return {
    success: response.data.success,
    message: response.data.message,
    data: transformedData,
    pagination: response.data.pagination,
  };
};

export const getMedicineById = async (id: string): Promise<any> => {
  const response = await api.get(`${MEDICINES_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Lấy danh sách batch còn hàng của một thuốc tại chi nhánh
 * API: GET /api/inventory/branch/:branchId/medicine/:medicineId/batches
 */
export const getBatchesByMedicineAndBranch = async (
  branchId: string,
  medicineId: string,
): Promise<Batch[]> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: any[];
  }>(`/inventory/branch/${branchId}/medicine/${medicineId}/batches`);

  // Map batch_code thành batch_number để đảm bảo tính nhất quán với type definition
  return response.data.data.map((batch: any) => ({
    ...batch,
    batch_number: batch.batch_code || batch.batch_number, // Hỗ trợ cả batch_code và batch_number
  }));
};
