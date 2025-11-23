import { useQuery } from '@tanstack/react-query';
import { userApi } from '@shared/services/user.api';

/**
 * Hook để lấy danh sách users của chi nhánh hiện tại hoặc chi nhánh chỉ định
 * @param branchId - ID của chi nhánh (nếu trống thì lấy chi nhánh hiện tại)
 */
export function useBranchUsers(branchId?: string) {
  return useQuery({
    queryKey: ['users', 'branch', branchId],
    queryFn: () => userApi.getUsersByBranchList(branchId),
    enabled: true, // Luôn fetch; nếu không có branchId sẽ lấy chi nhánh hiện tại
  });
}
