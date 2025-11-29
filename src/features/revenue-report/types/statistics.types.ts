// src/features/revenue-report/types/statistics.types.ts

/**
 * Common Query Parameters
 */
export interface BaseStatsParams {
  startDate?: string; // ISO format: "2024-01-01"
  endDate?: string; // ISO format: "2024-12-31"
  branchId?: string;
  employeeId?: string;
}

/**
 * Overall Statistics
 */
export interface OverallStatsParams extends BaseStatsParams {}

export interface OverallStatsData {
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
  totalDiscount: number;
  totalTax: number;
}

export interface OverallStatsResponse {
  success: boolean;
  message: string;
  data: OverallStatsData;
}

/**
 * Medicine Statistics
 */
export interface MedicineStatsParams extends BaseStatsParams {}

export interface MedicineStatsItem {
  _id: string;
  medicineName: string;
  medicineUnit: string;
  medicineCategory: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  timesOrdered: number;
}

export interface MedicineStatsResponse {
  success: boolean;
  message: string;
  total: number;
  data: MedicineStatsItem[];
}

/**
 * Top Selling Medicines
 */
export interface TopSellingParams extends BaseStatsParams {
  limit?: number; // Default: 10
}

export interface TopSellingItem {
  _id: string;
  medicineName: string;
  medicineUnit: string;
  medicineCategory: string;
  totalQuantity: number;
  totalRevenue: number;
  averagePrice: number;
  timesOrdered: number;
}

export interface TopSellingResponse {
  success: boolean;
  message: string;
  total: number;
  data: TopSellingItem[];
}

/**
 * Period Statistics
 */
export interface PeriodStatsParams extends BaseStatsParams {
  groupBy?: 'day' | 'month' | 'year'; // Default: 'day'
}

export interface PeriodStatsItem {
  _id: {
    year: number;
    month?: number;
    day?: number;
  };
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

export interface PeriodStatsResponse {
  success: boolean;
  message: string;
  groupBy: string;
  total: number;
  data: PeriodStatsItem[];
}

/**
 * Branch Statistics
 */
export interface BranchStatsParams {
  startDate?: string;
  endDate?: string;
  branchId?: string; // Optional: for branch_manager to filter by their branch
}

export interface BranchStatsItem {
  _id: string;
  branchName: string;
  branchAddress: string;
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

export interface BranchStatsResponse {
  success: boolean;
  message: string;
  total: number;
  data: BranchStatsItem[];
}

/**
 * Employee Statistics
 */
export interface EmployeeStatsParams {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}

export interface EmployeeStatsItem {
  _id: string;
  employeeName: string;
  employeeRole: string;
  totalQuantity: number;
  totalRevenue: number;
  totalInvoices: number;
}

export interface EmployeeStatsResponse {
  success: boolean;
  message: string;
  total: number;
  data: EmployeeStatsItem[];
}

/**
 * Dashboard Statistics
 */
export interface DashboardStatsParams extends BaseStatsParams {}

export interface DashboardStatsData {
  overall: OverallStatsData;
  topMedicines: TopSellingItem[];
  branchStats: BranchStatsItem[];
  employeeStats: EmployeeStatsItem[];
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStatsData;
}
