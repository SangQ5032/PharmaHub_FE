import { useQuery } from '@tanstack/react-query';
import { userApi } from '@shared/services/user.api';

/**
 * Hook để lấy danh sách users của chi nhánh hiện tại
 */
export function useBranchUsers() {
  return useQuery({
    queryKey: ['users', 'branch'],
    queryFn: () => userApi.getUsersByBranchList(),
  });
}
