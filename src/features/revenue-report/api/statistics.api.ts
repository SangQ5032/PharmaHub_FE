// src/features/revenue-report/api/statistics.api.ts
import apiClient from '@shared/services/api';
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
    const res = await apiClient.get(`${BASE_PATH}/by-branch`, { params });
    return res.data;
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
