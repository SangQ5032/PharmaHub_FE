// src/features/warehouse/hooks/useImports.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importsApi } from '@features/warehouse/api/imports.api';
import {
  GetImportsQuery,
  CreateImportBody,
} from '@features/warehouse/types/import.types';

/**
 * Hook để lấy danh sách phiếu nhập hàng
 * Sử dụng React Query để cache và auto-refetch
 */
export function useGetImports(query?: GetImportsQuery) {
  return useQuery({
    queryKey: ['imports', query],
    queryFn: () => importsApi.getImports(query),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy chi tiết phiếu nhập hàng
 */
export function useGetImportDetail(id: string) {
  return useQuery({
    queryKey: ['import', id],
    queryFn: () => importsApi.getImportDetail(id),
    enabled: !!id, // Chỉ fetch khi có id
  });
}

/**
 * Hook để tạo phiếu nhập hàng mới
 * Sử dụng useMutation để handle POST request
 */
export function useCreateImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateImportBody) => importsApi.createImport(body),
    onSuccess: () => {
      // Invalidate cache để refetch danh sách phiếu nhập
      queryClient.invalidateQueries({ queryKey: ['imports'] });
    },
  });
}

/**
 * Hook để lấy thống kê nhập hàng theo chi nhánh
 */
export function useGetImportStats(branchId: string) {
  return useQuery({
    queryKey: ['import-stats', branchId],
    queryFn: () => importsApi.getImportStats(branchId),
    enabled: !!branchId,
  });
}
