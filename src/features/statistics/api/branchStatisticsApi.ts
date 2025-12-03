import { apiClient } from '@shared/services/api';

/**
 * Branch Manager Statistics APIs
 * Base URL: /api/statistics/branch/:branchId
 */

// Types for request parameters
export interface StatisticsDateRangeParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface RevenueByPeriodParams extends StatisticsDateRangeParams {
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface ImportsStatsParams extends StatisticsDateRangeParams {
  supplierId?: string;
}

// Types for response data
export interface RevenueStatsResponse {
  totalRevenue: number;
  totalInvoices: number;
  totalQuantity: number;
  totalDiscount: number;
  totalTax: number;
  averageInvoiceValue: number;
}

export interface EmployeeStats {
  employeeId: string;
  employeeName: string;
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
}

export interface EmployeesStatsResponse {
  total: number;
  data: EmployeeStats[];
}

export interface MedicineDetail {
  medicineId: string;
  medicineName: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
  timesOrdered: number;
  averagePrice: number;
}

export interface MedicinesStatsResponse {
  overall: {
    totalQuantity: number;
    totalMedicineTypes: number;
    totalRevenue: number;
  };
  medicineDetails: MedicineDetail[];
}

export interface ImportRecord {
  _id: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  expiryDate: string;
  supplierName: string;
  createdAt: string;
}

export interface ImportsStatsResponse {
  total: number;
  data: ImportRecord[];
}

export interface BatchDetail {
  _id: string;
  batchNumber: string;
  medicineName: string;
  quantity: number;
  initialQuantity: number;
  status: 'active' | 'sold_out' | 'expired';
  expiryDate: string;
  importPrice: number;
  isExpired: boolean;
  isOutOfStock: boolean;
  quantitySold: number;
  stockStatus: string;
  expiryStatus: string;
}

export interface BatchStatusSummary {
  total: number;
  outOfStock: number;
  inStock: number;
  expired: number;
  expiringSoon: number;
  valid: number;
}

export interface BatchStatusStatsResponse {
  summary: BatchStatusSummary;
  details: BatchDetail[];
}

export interface CustomerStats {
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
  lastOrderDate: string;
}

export interface CustomersStatsResponse {
  total: number;
  data: CustomerStats[];
}

export interface RevenueByPeriodRecord {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  totalDiscount: number;
  totalTax: number;
}

export interface RevenueByPeriodStatsResponse {
  groupBy: 'day' | 'week' | 'month' | 'year';
  total: number;
  data: RevenueByPeriodRecord[];
}

// API Calls
export const branchStatisticsApi = {
  /**
   * GET /api/statistics/branch/:branchId/revenue
   * Thống kê doanh thu toàn cửa hàng
   */
  getRevenueStats: async (
    branchId: string,
    params?: StatisticsDateRangeParams,
  ): Promise<RevenueStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/revenue`,
      { params },
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/employees
   * Thống kê doanh thu từng nhân viên
   */
  getEmployeesStats: async (
    branchId: string,
    params?: StatisticsDateRangeParams,
  ): Promise<EmployeesStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/employees`,
      { params },
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/medicines
   * Thống kê số lượng thuốc bán ra
   */
  getMedicinesStats: async (
    branchId: string,
    params?: StatisticsDateRangeParams,
  ): Promise<MedicinesStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/medicines`,
      { params },
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/imports
   * Thống kê các lô hàng đã nhập
   */
  getImportsStats: async (
    branchId: string,
    params?: ImportsStatsParams,
  ): Promise<ImportsStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/imports`,
      { params },
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/batch-status
   * Thống kê tình trạng lô hàng
   */
  getBatchStatusStats: async (
    branchId: string,
  ): Promise<BatchStatusStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/batch-status`,
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/customers
   * Thống kê doanh thu theo khách hàng
   */
  getCustomersStats: async (
    branchId: string,
    params?: StatisticsDateRangeParams,
  ): Promise<CustomersStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/customers`,
      { params },
    );
    return response.data.data;
  },

  /**
   * GET /api/statistics/branch/:branchId/revenue-by-period
   * Thống kê doanh thu theo thời gian
   */
  getRevenueByPeriodStats: async (
    branchId: string,
    params?: RevenueByPeriodParams,
  ): Promise<RevenueByPeriodStatsResponse> => {
    const response = await apiClient.get(
      `/statistics/branch/${branchId}/revenue-by-period`,
      { params },
    );
    return response.data.data;
  },
};
