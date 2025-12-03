/**
 * System Admin Statistics API Service
 * Các API endpoints dành riêng cho role quản lý hệ thống (system_admin)
 */

import apiClient from '@shared/services/api';
import {
  OverallStatisticsResponse,
  BranchRevenueStatisticsResponse,
  EmployeeRevenueStatisticsResponse,
  TopSellingMedicinesResponse,
  RevenueByPeriodResponse,
  CustomerStatisticsResponse,
  ImportStatisticsResponse,
  BatchStatusResponse,
  DashboardResponse,
  StatisticsQueryParams,
  PeriodQueryParams,
  TopSellingQueryParams,
} from '../types/system-admin.types';

const BASE_PATH = '/statistics/system-admin';

export const systemAdminStatisticsApi = {
  /**
   * Get overall system statistics
   * Lấy thống kê tổng quan toàn hệ thống
   */
  getOverallStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<OverallStatisticsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/overall`, { params });
    return res.data;
  },

  /**
   * Get branch revenue statistics (all branches)
   * Lấy thống kê doanh thu từng chi nhánh
   */
  getBranchRevenueStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<BranchRevenueStatisticsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/branches-revenue`, {
      params,
    });
    return res.data;
  },

  /**
   * Get employee revenue statistics (all employees, all branches)
   * Lấy thống kê doanh thu từng nhân viên (toàn hệ thống)
   */
  getEmployeeRevenueStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<EmployeeRevenueStatisticsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/employees-revenue`, {
      params,
    });
    return res.data;
  },

  /**
   * Get top selling medicines across all branches
   * Lấy top thuốc bán chạy toàn hệ thống
   */
  getTopSellingMedicines: async (
    params?: TopSellingQueryParams,
  ): Promise<TopSellingMedicinesResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/top-selling`, { params });
    return res.data;
  },

  /**
   * Get revenue statistics by period (day/week/month/year)
   * Lấy thống kê doanh thu theo thời gian
   */
  getRevenueByPeriod: async (
    params?: PeriodQueryParams,
  ): Promise<RevenueByPeriodResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/revenue-by-period`, {
      params,
    });
    return res.data;
  },

  /**
   * Get customer statistics (all customers)
   * Lấy thống kê doanh thu theo khách hàng
   */
  getCustomerStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<CustomerStatisticsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/customers`, { params });
    return res.data;
  },

  /**
   * Get import statistics across all branches
   * Lấy thống kê nhập hàng toàn hệ thống
   */
  getImportStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<ImportStatisticsResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/imports`, { params });
    return res.data;
  },

  /**
   * Get batch status statistics (current status)
   * Lấy thống kê tình trạng batch toàn hệ thống (không cần date params)
   */
  getBatchStatusStatistics: async (): Promise<BatchStatusResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/batch-status`);
    return res.data;
  },

  /**
   * Get complete dashboard data (combines multiple endpoints)
   * Lấy dashboard tổng hợp (kết hợp nhiều endpoint)
   */
  getDashboard: async (
    params?: StatisticsQueryParams,
  ): Promise<DashboardResponse> => {
    const res = await apiClient.get(`${BASE_PATH}/dashboard`, { params });
    return res.data;
  },
};

export default systemAdminStatisticsApi;
