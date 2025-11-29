// src/features/revenue-report/api/statistics.api.ts
import apiClient from '@shared/services/api';
import branchApi from '@features/branches/api/branch.api';
import {
  OverallStatsParams,
  OverallStatsResponse,
  MedicineStatsParams,
  MedicineStatsResponse,
  TopSellingParams,
  TopSellingResponse,
  PeriodStatsParams,
  PeriodStatsResponse,
  BranchStatsParams,
  BranchStatsResponse,
  EmployeeStatsParams,
  EmployeeStatsResponse,
  DashboardStatsParams,
  DashboardStatsResponse,
} from '../types';

const BASE_PATH = '/statistics';

export const statisticsApi = {
  /**
   * Get overall statistics
   */
  getOverallStats: async (
    params?: OverallStatsParams,
  ): Promise<OverallStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/overall`, { params });
    return res.data;
  },

  /**
   * Get medicine statistics
   */
  getMedicineStats: async (
    params?: MedicineStatsParams,
  ): Promise<MedicineStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/medicines`, { params });
    return res.data;
  },

  /**
   * Get top selling medicines
   */
  getTopSellingMedicines: async (
    params?: TopSellingParams,
  ): Promise<TopSellingResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/top-selling`, { params });
    return res.data;
  },

  /**
   * Get statistics by period
   */
  getPeriodStats: async (
    params?: PeriodStatsParams,
  ): Promise<PeriodStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/by-period`, { params });
    return res.data;
  },

  /**
   * Get statistics by branch (system-admin only)
   */
  getBranchStats: async (
    params?: BranchStatsParams,
  ): Promise<BranchStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/by-branch`, {
      params,
    });

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || 'Không thể lấy thống kê chi nhánh');
  },

  /**
   * Get overall statistics for branch managers (filtered by their branch)
   * This returns data in a format similar to getBranchStats but for a single branch
   */
  getOverallStatsByBranch: async (
    params?: OverallStatsParams,
  ): Promise<BranchStatsResponse> => {
    console.log(
      '[statisticsApi] getOverallStatsByBranch called with params:',
      params,
    );
    const res = await apiClient.get(`${BASE_PATH}/overall`, {
      params,
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
    const data = res.data;

    console.log('[statisticsApi] getOverallStatsByBranch raw response:', data);

    // Transform overall stats response to match branch stats format
    // This allows branch managers to see their branch stats in the same UI
    if (data.success && data.data) {
      // Try to fetch branch info if branchId is provided
      let branchInfo = {
        name: 'Chi nhánh của bạn',
        address: '',
      };

      if (params?.branchId) {
        try {
          const branchRes = await branchApi.getBranchById(params.branchId);
          if (branchRes.success && branchRes.data) {
            branchInfo = {
              name: branchRes.data.name || 'Chi nhánh của bạn',
              address: branchRes.data.address || '',
            };
          }
        } catch (error) {
          console.log('Failed to fetch branch info:', error);
          // Continue with default values
        }
      }

      return {
        success: true,
        message: data.message,
        total: 1,
        data: [
          {
            _id: params?.branchId || '',
            branchName: branchInfo.name,
            branchAddress: branchInfo.address,
            totalQuantity: data.data.totalQuantity || 0,
            totalRevenue: data.data.totalRevenue || 0,
            totalInvoices: data.data.totalInvoices || 0,
          },
        ],
      };
    }

    return {
      success: false,
      message: 'Không thể lấy thống kê',
      total: 0,
      data: [],
    };
  },

  /**
   * Get statistics by employee
   */
  getEmployeeStats: async (
    params?: EmployeeStatsParams,
  ): Promise<EmployeeStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/by-employee`, { params });
    return res.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (
    params?: DashboardStatsParams,
  ): Promise<DashboardStatsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/dashboard`, { params });
    return res.data;
  },
};
