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
    // Response structure: { success, message, total, data: [...] }
    const apiResponse = response.data;
    const apiData = apiResponse.data || []; // Mảng các ImportRecord

    // Transform dữ liệu để đảm bảo batchNumber luôn có ở root level
    // Response đã có batchNumber ở root, nhưng cũng có thể có trong _id
    const transformedData = apiData.map((item: any) => {
      // Đảm bảo batchNumber luôn có ở root level (ưu tiên root, fallback về _id)
      const batchNumber = item.batchNumber || item._id?.batchNumber || '';

      // Giữ nguyên tất cả các trường khác từ response
      return {
        ...item,
        batchNumber, // Đảm bảo batchNumber luôn có ở root level
        // Các trường khác giữ nguyên từ response
        medicineName: item.medicineName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalCost: item.totalCost,
        supplierName: item.supplierName,
        expiryDate: item.expiryDate,
        createdAt: item.createdAt,
      };
    });

    return {
      total: apiResponse.total || transformedData.length,
      data: transformedData,
    };
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
    const data = response.data.data;

    // Hàm tính toán trạng thái hết hạn chính xác
    const calculateExpiryStatus = (expiryDate: string) => {
      if (!expiryDate) {
        return { isExpired: false, expiryStatus: 'Không rõ' };
      }

      const expiry = new Date(expiryDate);
      const now = new Date();

      // Reset time về 00:00:00 để so sánh chỉ theo ngày
      expiry.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const isExpired = expiry < now;
      const daysDiff = Math.ceil(
        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      let expiryStatus: string;
      if (isExpired) {
        expiryStatus = 'Hết hạn';
      } else if (daysDiff <= 30) {
        expiryStatus = 'Sắp hết hạn';
      } else {
        expiryStatus = 'Còn hạn';
      }

      return { isExpired, expiryStatus, daysDiff };
    };

    // Transform dữ liệu để đảm bảo batchNumber và tính lại trạng thái hết hạn
    const transformedDetails = (data.details || []).map((item: any) => {
      // Tìm batchNumber từ nhiều nguồn có thể
      const batchNumber =
        item.batchNumber ||
        item.batch_number ||
        item._id?.batchNumber ||
        item._id?.batch_number ||
        '';

      // Tìm expiryDate từ nhiều nguồn có thể
      const expiryDate = item.expiryDate || item.expiry_date || null;

      // Tính toán trạng thái hết hạn
      const expiryInfo = calculateExpiryStatus(expiryDate);

      return {
        ...item,
        batchNumber,
        expiryDate,
        isExpired: expiryInfo.isExpired,
        expiryStatus: expiryInfo.expiryStatus,
      };
    });

    // Tính lại summary dựa trên dữ liệu đã transform
    const summary = {
      total: transformedDetails.length,
      outOfStock: transformedDetails.filter((item: any) => item.quantity === 0)
        .length,
      inStock: transformedDetails.filter((item: any) => item.quantity > 0)
        .length,
      expired: transformedDetails.filter((item: any) => item.isExpired).length,
      expiringSoon: transformedDetails.filter(
        (item: any) => !item.isExpired && item.expiryStatus === 'Sắp hết hạn',
      ).length,
      valid: transformedDetails.filter(
        (item: any) => !item.isExpired && item.expiryStatus === 'Còn hạn',
      ).length,
    };

    return {
      summary,
      details: transformedDetails,
    };
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
