// src/features/warehouse/hooks/useImports.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importsApi } from '@features/warehouse/api/imports.api';
import {
  GetImportsQuery,
  CreateImportBody,
  UpdateImportStatusBody,
  CancelImportBody,
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
 * Hook để cập nhật trạng thái phiếu nhập hàng
 * Sử dụng useMutation để handle PATCH request
 */
export function useUpdateImportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateImportStatusBody }) =>
      importsApi.updateImportStatus(id, body),
    onSuccess: data => {
      // Update detail cache
      queryClient.invalidateQueries({ queryKey: ['import', data.data._id] });
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ['imports'] });
    },
  });
}

/**
 * Hook để hủy phiếu nhập hàng
 * Sử dụng useMutation để handle POST request
 */
export function useCancelImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CancelImportBody }) =>
      importsApi.cancelImport(id, body),
    onSuccess: data => {
      // Update detail cache
      queryClient.invalidateQueries({ queryKey: ['import', data.data._id] });
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ['imports'] });
    },
  });
}

/**
 * Hook để lấy danh sách phiếu nhập theo chi nhánh
 */
export function useGetImportsByBranch(
  branchId: string,
  query?: Omit<GetImportsQuery, 'branch_id'>,
) {
  return useQuery({
    queryKey: ['imports', 'branch', branchId, query],
    queryFn: () => importsApi.getImportsByBranch(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy thống kê nhập hàng theo chi nhánh
 */
export function useGetImportStats(
  branchId: string,
  query?: { from_date?: string; to_date?: string },
) {
  return useQuery({
    queryKey: ['import-stats', branchId, query],
    queryFn: () => importsApi.getImportStats(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}
