import { useQuery } from '@tanstack/react-query';
import {
  branchStatisticsApi,
  StatisticsDateRangeParams,
  RevenueByPeriodParams,
  ImportsStatsParams,
} from '../api/branchStatisticsApi';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

/**
 * Hook để lấy thống kê doanh thu chi nhánh
 */
export const useRevenueStats = (params?: StatisticsDateRangeParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['revenueStats', branchId, params],
    queryFn: () => branchStatisticsApi.getRevenueStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy thống kê doanh thu từng nhân viên
 */
export const useEmployeesStats = (params?: StatisticsDateRangeParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['employeesStats', branchId, params],
    queryFn: () => branchStatisticsApi.getEmployeesStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy thống kê số lượng thuốc bán ra
 */
export const useMedicinesStats = (params?: StatisticsDateRangeParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['medicinesStats', branchId, params],
    queryFn: () => branchStatisticsApi.getMedicinesStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy thống kê nhập hàng
 */
export const useImportsStats = (params?: ImportsStatsParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['importsStats', branchId, params],
    queryFn: () => branchStatisticsApi.getImportsStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy thống kê tình trạng lô hàng
 */
export const useBatchStatusStats = () => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['batchStatusStats', branchId],
    queryFn: () => branchStatisticsApi.getBatchStatusStats(branchId!),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy thống kê doanh thu theo khách hàng
 */
export const useCustomersStats = (params?: StatisticsDateRangeParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['customersStats', branchId, params],
    queryFn: () => branchStatisticsApi.getCustomersStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy thống kê doanh thu theo thời gian
 */
export const useRevenueByPeriodStats = (params?: RevenueByPeriodParams) => {
  const { user } = useAuthStore();
  const branchId = user?.branchId || user?.branch_id;

  return useQuery({
    queryKey: ['revenueByPeriodStats', branchId, params],
    queryFn: () =>
      branchStatisticsApi.getRevenueByPeriodStats(branchId!, params),
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000,
  });
};
