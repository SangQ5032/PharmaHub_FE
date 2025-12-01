import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPayrollPreview,
  createPayroll,
  getPayrollList,
  getPayrollDetail,
  updatePayroll,
  approvePayroll,
  rejectPayroll,
  getBranchPayrollSummary,
} from '../api/payroll.service';
import {
  PayrollPreview,
  PayrollDetail,
  CreatePayrollRequest,
  UpdatePayrollRequest,
  ApprovePayrollRequest,
  RejectPayrollRequest,
  ListPayrollFilters,
  BranchPayrollSummary,
} from '../types';

// Hook to get payroll preview
export const usePayrollPreview = (
  userId: string,
  branchId: string,
  month: string,
) => {
  return useQuery({
    queryKey: ['payrollPreview', userId, branchId, month],
    queryFn: () => getPayrollPreview(userId, branchId, month),
    enabled: !!userId && !!branchId && !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create payroll
export const useCreatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePayrollRequest) => createPayroll(data),
    onSuccess: () => {
      // Invalidate payroll list to refetch
      queryClient.invalidateQueries({ queryKey: ['payrollList'] });
      queryClient.invalidateQueries({ queryKey: ['payrollPreview'] });
    },
  });
};

// Hook to get payroll list
export const usePayrollList = (filters: ListPayrollFilters) => {
  // Create stable query key based on filter values
  const queryKey = [
    'payrollList',
    filters.branch_id,
    filters.month,
    filters.status,
    filters.user_id,
    filters.page,
    filters.limit,
  ];

  return useQuery({
    queryKey: queryKey,
    queryFn: () => getPayrollList(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - data considered fresh for 1 min
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 min
    refetchOnWindowFocus: 'stale', // Refetch only if stale
    refetchOnReconnect: 'stale', // Refetch only if stale when reconnecting
    refetchOnMount: 'stale', // Refetch only if stale when component mounts
    retry: 1,
  });
};

// Hook to get payroll details
// Hook to get payroll details
export const usePayrollDetail = (payrollId: string) => {
  return useQuery({
    queryKey: ['payrollDetail', payrollId],
    queryFn: () => getPayrollDetail(payrollId),
    enabled: !!payrollId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
// Hook to update payroll
export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payrollId,
      data,
    }: {
      payrollId: string;
      data: UpdatePayrollRequest;
    }) => updatePayroll(payrollId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific payroll detail
      queryClient.invalidateQueries({
        queryKey: ['payrollDetail', variables.payrollId],
      });
      // Invalidate payroll list
      queryClient.invalidateQueries({ queryKey: ['payrollList'] });
    },
  });
};

// Hook to approve payroll
export const useApprovePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payrollId,
      data,
    }: {
      payrollId: string;
      data: ApprovePayrollRequest;
    }) => approvePayroll(payrollId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific payroll detail
      queryClient.invalidateQueries({
        queryKey: ['payrollDetail', variables.payrollId],
      });
      // Invalidate payroll list
      queryClient.invalidateQueries({ queryKey: ['payrollList'] });
      // Invalidate branch summary
      queryClient.invalidateQueries({ queryKey: ['branchPayrollSummary'] });
    },
  });
};

// Hook to reject payroll
export const useRejectPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payrollId,
      data,
    }: {
      payrollId: string;
      data: RejectPayrollRequest;
    }) => rejectPayroll(payrollId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific payroll detail
      queryClient.invalidateQueries({
        queryKey: ['payrollDetail', variables.payrollId],
      });
      // Invalidate payroll list
      queryClient.invalidateQueries({ queryKey: ['payrollList'] });
      // Invalidate branch summary
      queryClient.invalidateQueries({ queryKey: ['branchPayrollSummary'] });
    },
  });
};

// Hook to get branch payroll summary
export const useBranchPayrollSummary = (branchId: string, month: string) => {
  return useQuery({
    queryKey: ['branchPayrollSummary', branchId, month],
    queryFn: () => getBranchPayrollSummary(branchId, month),
    enabled: !!branchId && !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
