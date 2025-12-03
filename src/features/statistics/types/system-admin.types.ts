/**
 * System Admin Statistics Types
 * Các types dành riêng cho role quản lý hệ thống (system_admin)
 */

// ============= Request/Response Types =============

/**
 * Overall Statistics Response - Thống kê tổng quan toàn hệ thống
 */
export interface OverallStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    totalRevenue: number;
    totalInvoices: number;
    totalQuantity: number;
    totalDiscount: number;
    totalTax: number;
    averageInvoiceValue: number;
    totalBranches: number;
  };
}

/**
 * Branch Revenue Statistics - Doanh thu từng chi nhánh
 */
export interface BranchRevenueItem {
  branchId: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  totalRevenue: number;
  totalInvoices: number;
  totalQuantity: number;
  totalDiscount: number;
  totalTax: number;
  averageInvoiceValue: number;
}

export interface BranchRevenueStatisticsResponse {
  success: boolean;
  message: string;
  total: number;
  data: BranchRevenueItem[];
}

/**
 * Employee Revenue Statistics - Doanh thu từng nhân viên
 */
export interface EmployeeRevenueItem {
  employeeId: string;
  employeeName: string;
  employeeUsername: string;
  branchName: string;
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
}

export interface EmployeeRevenueStatisticsResponse {
  success: boolean;
  message: string;
  total: number;
  data: EmployeeRevenueItem[];
}

/**
 * Top Selling Medicines - Thuốc bán chạy nhất
 */
export interface TopSellingMedicineItem {
  medicineId: string;
  medicineName: string;
  medicineUnit: string;
  medicineCategory?: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  timesOrdered: number;
  branchesCount: number;
}

export interface TopSellingMedicinesResponse {
  success: boolean;
  message: string;
  total: number;
  data: TopSellingMedicineItem[];
}

/**
 * Revenue by Period - Doanh thu theo thời gian
 */
export interface RevenuePeriodItem {
  _id: string; // Format: "2024-01-01" (day), "2024-W01" (week), "2024-01" (month), "2024" (year)
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  totalDiscount: number;
  totalTax: number;
}

export interface RevenueByPeriodResponse {
  success: boolean;
  message: string;
  groupBy: 'day' | 'week' | 'month' | 'year';
  total: number;
  data: RevenuePeriodItem[];
}

/**
 * Customer Statistics - Doanh thu theo khách hàng
 */
export interface CustomerStatisticItem {
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  averageOrderValue: number;
  lastOrderDate: string;
  branchesCount: number;
}

export interface CustomerStatisticsResponse {
  success: boolean;
  message: string;
  total: number;
  data: CustomerStatisticItem[];
}

/**
 * Import Statistics - Thống kê nhập hàng
 */
export interface ImportStatisticsData {
  totalImports: number;
  totalQuantity: number;
  totalCost: number;
  totalBatches: number;
}

export interface ImportStatisticsResponse {
  success: boolean;
  message: string;
  data: ImportStatisticsData;
}

/**
 * Batch Status - Tình trạng batch/lô hàng
 */
export interface BatchStatusSummary {
  total: number;
  outOfStock: number;
  inStock: number;
  expired: number;
  expiringSoon: number;
  valid: number;
}

export interface BatchStatusItem {
  _id: string;
  medicineName: string;
  branchName: string;
  quantity: number;
  isExpired: boolean;
  isOutOfStock: boolean;
  quantitySold: number | null;
  stockStatus: string;
  expiryStatus: string;
}

export interface BatchStatusResponse {
  success: boolean;
  message: string;
  data: {
    summary: BatchStatusSummary;
    details: BatchStatusItem[];
  };
}

/**
 * Dashboard Response - Tổng hợp tất cả thống kê
 */
export interface DashboardData {
  overall: OverallStatisticsResponse['data'];
  topMedicines: TopSellingMedicineItem[];
  branchStats: BranchRevenueItem[];
  employeeStats: EmployeeRevenueItem[];
  imports: ImportStatisticsData;
  batchStatus: {
    summary: BatchStatusSummary;
    details?: BatchStatusItem[];
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

// ============= Query Parameters =============

export interface StatisticsQueryParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface PeriodQueryParams extends StatisticsQueryParams {
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface TopSellingQueryParams extends StatisticsQueryParams {
  limit?: number; // Default: 10, Max: 100
}

// ============= Hook Return Types =============

export interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
