// src/features/warehouse/hooks/useCrossBranchInventory.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import { crossBranchApi } from '@features/warehouse/api/cross-branch.api';
import {
  CrossBranchInventoryQuery,
  FindAvailableBranchesQuery,
} from '@features/warehouse/types/cross-branch.types';

/**
 * Hook để lấy danh sách tồn kho cross-branch (tất cả chi nhánh)
 * Sử dụng React Query để cache và auto-refetch
 */
export function useGetCrossBranchInventory(query?: CrossBranchInventoryQuery) {
  return useQuery({
    queryKey: ['cross-branch-inventory', query],
    queryFn: () => crossBranchApi.getCrossBranchInventory(query),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để so sánh tồn kho của 1 thuốc giữa các chi nhánh
 */
export function useCompareBranchStock(medicine_id: string) {
  return useQuery({
    queryKey: ['compare-branch-stock', medicine_id],
    queryFn: () => crossBranchApi.compareBranchStock(medicine_id),
    enabled: !!medicine_id, // Chỉ fetch khi có medicine_id
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để tìm chi nhánh có đủ hàng
 * Sử dụng useMutation vì đây là action tìm kiếm (không auto-fetch)
 */
export function useFindAvailableBranches() {
  return useMutation({
    mutationFn: (params: FindAvailableBranchesQuery) =>
      crossBranchApi.findAvailableBranches(params),
  });
}
