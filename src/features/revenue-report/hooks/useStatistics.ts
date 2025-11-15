// src/features/revenue-report/hooks/useStatistics.ts
import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../api/statistics.api';
import {
  OverallStatsParams,
  MedicineStatsParams,
  TopSellingParams,
  PeriodStatsParams,
  BranchStatsParams,
  EmployeeStatsParams,
  DashboardStatsParams,
} from '../types';

/**
 * Hook to get overall statistics
 */
export const useOverallStats = (params?: OverallStatsParams) => {
  return useQuery({
    queryKey: ['overallStats', params],
    queryFn: () => statisticsApi.getOverallStats(params),
  });
};

/**
 * Hook to get medicine statistics
 */
export const useMedicineStats = (params?: MedicineStatsParams) => {
  return useQuery({
    queryKey: ['medicineStats', params],
    queryFn: () => statisticsApi.getMedicineStats(params),
  });
};

/**
 * Hook to get top selling medicines
 */
export const useTopSellingMedicines = (params?: TopSellingParams) => {
  return useQuery({
    queryKey: ['topSellingMedicines', params],
    queryFn: () => statisticsApi.getTopSellingMedicines(params),
  });
};

/**
 * Hook to get period statistics
 */
export const usePeriodStats = (params?: PeriodStatsParams) => {
  return useQuery({
    queryKey: ['periodStats', params],
    queryFn: () => statisticsApi.getPeriodStats(params),
  });
};

/**
 * Hook to get branch statistics
 */
export const useBranchStats = (params?: BranchStatsParams) => {
  return useQuery({
    queryKey: ['branchStats', params],
    queryFn: () => statisticsApi.getBranchStats(params),
  });
};

/**
 * Hook to get employee statistics
 */
export const useEmployeeStats = (params?: EmployeeStatsParams) => {
  return useQuery({
    queryKey: ['employeeStats', params],
    queryFn: () => statisticsApi.getEmployeeStats(params),
  });
};

/**
 * Hook to get dashboard statistics
 */
export const useDashboardStats = (params?: DashboardStatsParams) => {
  return useQuery({
    queryKey: ['dashboardStats', params],
    queryFn: () => statisticsApi.getDashboardStats(params),
  });
};
