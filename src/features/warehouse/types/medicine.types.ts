// src/features/warehouse/types/medicine.types.ts

/**
 * Thông tin thuốc
 */
export interface Medicine {
  _id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  price: number;
  expiry_date: string;
  supplier_id: string;
  warning_threshold: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Response từ API GET /api/medicines
 */
export interface GetMedicinesResponse {
  success: boolean;
  data: Medicine[];
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
