/**
 * System Admin Statistics Hooks
 * Custom hooks for system admin statistics queries
 */

import { useQuery } from '@tanstack/react-query';
import systemAdminStatisticsApi from '../api/system-admin.api';
import {
  StatisticsQueryParams,
  PeriodQueryParams,
  TopSellingQueryParams,
} from '../types/system-admin.types';
import { useAuth } from '@app/providers/AuthProvider';

/**
 * Hook to fetch overall system statistics
 * Lấy thống kê tổng quan toàn hệ thống
 */
export const useSystemAdminOverallStats = (params?: StatisticsQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminOverallStats', params],
    queryFn: () => systemAdminStatisticsApi.getOverallStatistics(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch branch revenue statistics (all branches)
 * Lấy thống kê doanh thu từng chi nhánh
 */
export const useSystemAdminBranchRevenue = (params?: StatisticsQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminBranchRevenue', params],
    queryFn: () => systemAdminStatisticsApi.getBranchRevenueStatistics(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch employee revenue statistics (all employees)
 * Lấy thống kê doanh thu từng nhân viên
 */
export const useSystemAdminEmployeeRevenue = (
  params?: StatisticsQueryParams,
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminEmployeeRevenue', params],
    queryFn: () =>
      systemAdminStatisticsApi.getEmployeeRevenueStatistics(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch top selling medicines across all branches
 * Lấy top thuốc bán chạy toàn hệ thống
 */
export const useSystemAdminTopSellingMedicines = (
  params?: TopSellingQueryParams,
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminTopSelling', params],
    queryFn: () => systemAdminStatisticsApi.getTopSellingMedicines(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch revenue by period (day/week/month/year)
 * Lấy thống kê doanh thu theo thời gian
 */
export const useSystemAdminRevenueByPeriod = (params?: PeriodQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminRevenueByPeriod', params],
    queryFn: () => systemAdminStatisticsApi.getRevenueByPeriod(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch customer statistics (all customers)
 * Lấy thống kê doanh thu theo khách hàng
 */
export const useSystemAdminCustomerStats = (params?: StatisticsQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminCustomerStats', params],
    queryFn: () => systemAdminStatisticsApi.getCustomerStatistics(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch import statistics (all branches)
 * Lấy thống kê nhập hàng toàn hệ thống
 */
export const useSystemAdminImportStats = (params?: StatisticsQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminImportStats', params],
    queryFn: () => systemAdminStatisticsApi.getImportStatistics(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch batch status statistics (no date params)
 * Lấy thống kê tình trạng batch hiện tại
 */
export const useSystemAdminBatchStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminBatchStatus'],
    queryFn: () => systemAdminStatisticsApi.getBatchStatusStatistics(),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 10 * 60 * 1000, // 10 minutes (batch status changes less frequently)
  });
};

/**
 * Hook to fetch complete dashboard data
 * Lấy dashboard tổng hợp toàn bộ dữ liệu cần thiết
 */
export const useSystemAdminDashboard = (params?: StatisticsQueryParams) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['systemAdminDashboard', params],
    queryFn: () => systemAdminStatisticsApi.getDashboard(params),
    enabled: !!user && user.role === 'system-admin',
    staleTime: 5 * 60 * 1000,
  });
};
