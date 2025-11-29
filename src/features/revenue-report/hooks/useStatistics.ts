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
import { useAuth } from '@app/providers/AuthProvider';

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
 * Automatically selects the correct API based on user role:
 * - system_admin: Uses /by-branch endpoint (all branches)
 * - branch_manager: Uses /overall endpoint with branchId (single branch)
 */
export const useBranchStats = (params?: BranchStatsParams) => {
  const { user } = useAuth();
  const userRole = user?.role;

  console.log('[useBranchStats] Hook called', {
    user,
    userRole,
    params,
    enabled: !!user,
  });

  return useQuery({
    queryKey: ['branchStats', params, userRole],
    queryFn: async () => {
      console.log('[useBranchStats] queryFn executing', { userRole });

      // System admin can see all branches
      if (userRole === 'system-admin') {
        console.log('[useBranchStats] Calling getBranchStats for system_admin');
        return statisticsApi.getBranchStats(params);
      }

      // Branch manager and other roles use overall stats with their branchId
      // The branchId should be passed in params or from user.branch_id
      const branchId = params?.branchId || user?.branch_id;

      console.log('[useBranchStats] branchId:', branchId);

      if (!branchId) {
        throw new Error('Branch ID is required for this role');
      }

      console.log('[useBranchStats] Calling getOverallStatsByBranch');
      return statisticsApi.getOverallStatsByBranch({
        ...params,
        branchId,
      });
    },
    enabled: !!user, // Only run query when user is available
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
