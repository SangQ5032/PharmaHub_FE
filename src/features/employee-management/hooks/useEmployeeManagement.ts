import { useCallback, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import employeeApi from '../api/employee.api';
import {
  Employee,
  AssignBranchPayload,
  TransferBranchPayload,
} from '../types/types';
import { useAuthStore } from '@features/auth';

export const useEmployeeManagement = (branchId?: string) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const { user } = useAuthStore();

  // Nếu không truyền branchId nhưng user là system_admin, lấy tất cả nhân viên
  const shouldFetchAll = user?.role === 'system_admin' && !branchId;
  const queryBranchId = shouldFetchAll ? undefined : branchId;

  // Fetch employees by branch
  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
    error: employeesError,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ['employees', queryBranchId],
    queryFn: () => employeeApi.getEmployeesByBranch(queryBranchId),
    enabled: branchId !== undefined || shouldFetchAll,
  });

  const employees = employeesData?.data || [];

  // Assign branch mutation
  const assignBranchMutation = useMutation({
    mutationFn: ({ userId, branchId: assignBranchId }: AssignBranchPayload) =>
      employeeApi.assignBranch(userId, assignBranchId),
    onSuccess: () => {
      refetchEmployees();
      setSelectedEmployee(null);
    },
  });

  // Transfer branch mutation
  const transferBranchMutation = useMutation({
    mutationFn: ({ userId, newBranchId }: TransferBranchPayload) =>
      employeeApi.transferBranch(userId, newBranchId),
    onSuccess: () => {
      refetchEmployees();
      setSelectedEmployee(null);
    },
  });

  const handleAssignBranch = useCallback(
    async (userId: string, targetBranchId: string) => {
      try {
        await assignBranchMutation.mutateAsync({
          userId,
          branchId: targetBranchId,
        });
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error?.response?.data?.message || 'Failed to assign branch',
        };
      }
    },
    [assignBranchMutation],
  );

  const handleTransferBranch = useCallback(
    async (userId: string, newBranchId: string) => {
      try {
        await transferBranchMutation.mutateAsync({ userId, newBranchId });
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error?.response?.data?.message || 'Failed to transfer branch',
        };
      }
    },
    [transferBranchMutation],
  );

  return {
    employees,
    selectedEmployee,
    setSelectedEmployee,
    isLoadingEmployees,
    employeesError,
    refetchEmployees,
    handleAssignBranch,
    handleTransferBranch,
    isAssigning: assignBranchMutation.isPending,
    isTransferring: transferBranchMutation.isPending,
    assignError: assignBranchMutation.error,
    transferError: transferBranchMutation.error,
  };
};

// Hook for getting all employees (not filtered by branch)
export const useAllEmployees = () => {
  const {
    data: employeesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['all-employees'],
    queryFn: () => employeeApi.getAllUsers(),
  });

  const employees = employeesData?.data || [];

  return {
    employees,
    isLoading,
    error,
    refetch,
  };
};
