// src/features/warehouse/types/medicine.types.ts

/**
 * Thông tin danh mục thuốc
 */
export interface MedicineCategory {
  _id: string;
  name: string;
  description?: string;
}

/**
 * Thông tin thuốc
 */
export interface Medicine {
  _id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  dosage_form?: string;
  strength?: string;
  unit: string;
  packaging?: string;
  category_id?: MedicineCategory | null;
  prescription_required?: boolean;
  is_controlled?: boolean;
  retail_price: number;
  minimum_price?: number | null;
  max_price?: number | null;
  manufacturer?: string;
  country_of_origin?: string;
  indications?: string;
  contraindications?: string;
  side_effects?: string;
  usage_instructions?: string;
  storage_conditions?: string;
  registration_number?: string;
  barcode?: string;
  alert_threshold?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response từ API GET /api/medicines
 */
export interface GetMedicinesResponse {
  success: boolean;
  data: Medicine[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query params để lấy danh sách thuốc
 */
export interface GetMedicinesQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  supplier_id?: string;
}
