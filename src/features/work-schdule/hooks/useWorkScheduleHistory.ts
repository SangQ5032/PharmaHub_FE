import { useEffect, useState, useMemo } from 'react';
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
    // KHÔNG gửi shift lên API - sẽ lọc ở frontend
  };

  // Tạo query key - không include shift vì không gửi lên API
  const queryKey = [
    'work-history-me',
    filters?.page || 1,
    filters?.limit || 10,
    filters?.fromDate,
    filters?.toDate,
  ];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => workScheduleApi.getMyWorkHistory(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Lọc dữ liệu ở frontend dựa trên shift filter
  const filteredData = useMemo(() => {
    if (!queryResult.data?.data) {
      return queryResult.data;
    }

    // Nếu không có shift filter, trả về data gốc
    if (!filters?.shift) {
      return queryResult.data;
    }

    // Lọc data theo shift
    const filteredRecords = queryResult.data.data.filter(
      (record: WorkScheduleHistoryRecord) => record.shift === filters.shift,
    );

    return {
      ...queryResult.data,
      data: filteredRecords,
      pagination: {
        ...queryResult.data.pagination,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / (filters?.limit || 10)),
      },
    };
  }, [queryResult.data, filters?.shift, filters?.limit]);

  return {
    ...queryResult,
    data: filteredData,
  };
};

/**
 * Hook để lấy lịch sử làm việc nhân viên trong chi nhánh (Branch Manager)
 */
export const useBranchEmployeesWorkHistory = (filters?: WorkHistoryFilters) => {
  // Tạo params object, KHÔNG gửi shift lên API - sẽ lọc ở frontend
  const params: WorkScheduleHistoryParams = {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    ...(filters?.fromDate && { from_date: filters.fromDate }),
    ...(filters?.toDate && { to_date: filters.toDate }),
    // KHÔNG gửi shift lên API - sẽ lọc ở frontend
    ...(filters?.userId && { user_id: filters.userId }),
  };

  // Tạo query key - không include shift vì không gửi lên API
  const queryKey = [
    'work-history-branch-employees',
    filters?.page || 1,
    filters?.limit || 10,
    filters?.fromDate,
    filters?.toDate,
    filters?.userId,
  ];

  // Nếu có userId trong filters, enable query
  // Nếu không có userId, vẫn enable để lấy tất cả nhân viên (cho branch manager xem tất cả)
  const isEnabled = true;

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await workScheduleApi.getBranchEmployeesWorkHistory(
        params,
      );
      return result;
    },
    enabled: isEnabled,
    staleTime: 0, // Không cache để đảm bảo data luôn mới nhất
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Lọc dữ liệu ở frontend dựa trên shift filter
  const filteredData = useMemo(() => {
    if (!queryResult.data?.data) {
      return queryResult.data;
    }

    // Nếu không có shift filter, trả về data gốc
    if (!filters?.shift) {
      return queryResult.data;
    }

    // Lọc data theo shift
    const filteredRecords = queryResult.data.data.filter(
      (record: WorkScheduleHistoryRecord) => record.shift === filters.shift,
    );

    return {
      ...queryResult.data,
      data: filteredRecords,
      pagination: {
        ...queryResult.data.pagination,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / (filters?.limit || 10)),
      },
    };
  }, [queryResult.data, filters?.shift, filters?.limit]);

  return {
    ...queryResult,
    data: filteredData,
  };
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
    // KHÔNG gửi shift lên API - sẽ lọc ở frontend
    ...(filters?.userId && { user_id: filters.userId }),
    ...(filters?.branchId && { branch_id: filters.branchId }),
  };

  // Tạo query key - không include shift vì không gửi lên API
  const queryKey = [
    'work-history-all',
    filters?.page || 1,
    filters?.limit || 10,
    filters?.fromDate,
    filters?.toDate,
    filters?.userId,
    filters?.branchId,
  ];

  const queryResult = useQuery({
    queryKey,
    queryFn: () => workScheduleApi.getAllWorkHistory(params),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  // Lọc dữ liệu ở frontend dựa trên shift filter
  const filteredData = useMemo(() => {
    if (!queryResult.data?.data) {
      return queryResult.data;
    }

    // Nếu không có shift filter, trả về data gốc
    if (!filters?.shift) {
      return queryResult.data;
    }

    // Lọc data theo shift
    const filteredRecords = queryResult.data.data.filter(
      (record: WorkScheduleHistoryRecord) => record.shift === filters.shift,
    );

    return {
      ...queryResult.data,
      data: filteredRecords,
      pagination: {
        ...queryResult.data.pagination,
        total: filteredRecords.length,
        totalPages: Math.ceil(filteredRecords.length / (filters?.limit || 10)),
      },
    };
  }, [queryResult.data, filters?.shift, filters?.limit]);

  return {
    ...queryResult,
    data: filteredData,
  };
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
