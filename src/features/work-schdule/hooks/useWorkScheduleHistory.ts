import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workScheduleApi } from '@features/work-schdule/api/work-schedule.api';
import {
  WorkScheduleHistoryRecord,
  WorkScheduleHistoryParams,
  WorkHistoryFilters,
} from '@features/work-schdule/types/workScheduleHistory.types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

/**
 * Hook để lấy lịch sử làm việc của user hiện tại (Employee)
 */
export const useMyWorkHistory = (filters?: WorkHistoryFilters) => {
  const params: WorkScheduleHistoryParams = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.fromDate && { from_date: filters.fromDate }),
    ...(filters?.toDate && { to_date: filters.toDate }),
    ...(filters?.shift && { shift: filters.shift }),
  };

  return useQuery({
    queryKey: ['work-history-me', params],
    queryFn: () => workScheduleApi.getMyWorkHistory(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy lịch sử làm việc nhân viên trong chi nhánh (Branch Manager)
 */
export const useBranchEmployeesWorkHistory = (filters?: WorkHistoryFilters) => {
  const params: WorkScheduleHistoryParams = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.fromDate && { from_date: filters.fromDate }),
    ...(filters?.toDate && { to_date: filters.toDate }),
    ...(filters?.shift && { shift: filters.shift }),
    ...(filters?.userId && { user_id: filters.userId }),
  };

  // Nếu có userId trong filters, enable query
  // Nếu không có userId, vẫn enable để lấy tất cả nhân viên (cho branch manager xem tất cả)
  const isEnabled = true;

  return useQuery({
    queryKey: ['work-history-branch-employees', params],
    queryFn: () => workScheduleApi.getBranchEmployeesWorkHistory(params),
    enabled: isEnabled,
    staleTime: 0, // Không cache để đảm bảo data luôn mới nhất
    // Refetch khi params thay đổi (bao gồm userId)
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook để lấy lịch sử làm việc của tất cả các chi nhánh (System Admin)
 */
export const useAllWorkHistory = (filters?: WorkHistoryFilters) => {
  const params: WorkScheduleHistoryParams = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.fromDate && { from_date: filters.fromDate }),
    ...(filters?.toDate && { to_date: filters.toDate }),
    ...(filters?.shift && { shift: filters.shift }),
    ...(filters?.userId && { user_id: filters.userId }),
    ...(filters?.branchId && { branch_id: filters.branchId }),
  };

  return useQuery({
    queryKey: ['work-history-all', params],
    queryFn: () => workScheduleApi.getAllWorkHistory(params),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy lịch sử làm việc dựa vào role của user hiện tại
 * Tự động chọn endpoint phù hợp theo role
 */
export const useWorkHistory = (filters?: WorkHistoryFilters) => {
  const user = useAuthStore(state => state.user);
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    'employee' | 'branch-manager' | 'system-admin' | null
  >(null);

  // Xác định endpoint dựa vào role
  useEffect(() => {
    const role = user?.role;
    if (role === 'employee') {
      setSelectedEndpoint('employee');
    } else if (role === 'branch-manager') {
      setSelectedEndpoint('branch-manager');
    } else if (role === 'system-admin') {
      setSelectedEndpoint('system-admin');
    }
  }, [user?.role]);

  // Gọi hook phù hợp dựa vào endpoint
  const employeeQuery = useMyWorkHistory(
    selectedEndpoint === 'employee' ? filters : undefined,
  );
  const branchManagerQuery = useBranchEmployeesWorkHistory(
    selectedEndpoint === 'branch-manager' ? filters : undefined,
  );
  const adminQuery = useAllWorkHistory(
    selectedEndpoint === 'system-admin' ? filters : undefined,
  );

  // Return query phù hợp
  if (selectedEndpoint === 'employee') {
    return employeeQuery;
  } else if (selectedEndpoint === 'branch-manager') {
    return branchManagerQuery;
  } else if (selectedEndpoint === 'system-admin') {
    return adminQuery;
  }

  // Default return
  return {
    data: undefined,
    isLoading: false,
    error: null,
    isError: false,
    status: 'idle' as const,
  };
};

/**
 * Hook utility để format dữ liệu work history
 */
export const useFormattedWorkHistory = (data?: WorkScheduleHistoryRecord[]) => {
  const [groupedByDate, setGroupedByDate] = useState<
    Record<string, WorkScheduleHistoryRecord[]>
  >({});
  const [groupedByEmployee, setGroupedByEmployee] = useState<
    Record<string, WorkScheduleHistoryRecord[]>
  >({});

  useEffect(() => {
    if (!data) return;

    // Group by date
    const byDate = data.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {} as Record<string, WorkScheduleHistoryRecord[]>);

    // Group by employee
    const byEmployee = data.reduce((acc, record) => {
      const employeeId = record.user_id._id;
      if (!acc[employeeId]) {
        acc[employeeId] = [];
      }
      acc[employeeId].push(record);
      return acc;
    }, {} as Record<string, WorkScheduleHistoryRecord[]>);

    setGroupedByDate(byDate);
    setGroupedByEmployee(byEmployee);
  }, [data]);

  return {
    groupedByDate,
    groupedByEmployee,
  };
};
