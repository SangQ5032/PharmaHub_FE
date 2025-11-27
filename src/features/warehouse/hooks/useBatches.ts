// src/features/warehouse/hooks/useBatches.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchesApi } from '@features/warehouse/api/batches.api';
import {
  GetBatchesQuery,
  CreateBatchBody,
  UpdateBatchBody,
} from '@features/warehouse/types/batch.types';

/**
 * Hook để lấy danh sách lô thuốc theo chi nhánh
 */
export function useGetBatchesByBranch(
  branchId: string,
  query?: GetBatchesQuery,
) {
  return useQuery({
    queryKey: ['batches', 'branch', branchId, query],
    queryFn: () => batchesApi.getBatchesByBranch(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy danh sách lô theo thuốc
 */
export function useGetBatchesByMedicine(branchId: string, medicineId: string) {
  return useQuery({
    queryKey: ['batches', 'medicine', branchId, medicineId],
    queryFn: () => batchesApi.getBatchesByMedicine(branchId, medicineId),
    enabled: !!branchId && !!medicineId,
  });
}

/**
 * Hook để lấy chi tiết lô
 */
export function useGetBatchDetail(id: string) {
  return useQuery({
    queryKey: ['batch', 'detail', id],
    queryFn: () => batchesApi.getBatchDetail(id),
    enabled: !!id,
  });
}

/**
 * Hook để lấy danh sách thuốc + lô của chi nhánh
 */
export function useGetMedicinesWithBatches(
  branchId: string,
  query?: GetBatchesQuery,
) {
  return useQuery({
    queryKey: ['batches', 'medicines', branchId, query],
    queryFn: () => batchesApi.getMedicinesWithBatches(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để tạo lô thuốc mới
 */
export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBatchBody) => batchesApi.createBatch(body),
    onSuccess: () => {
      // Invalidate cache để refetch danh sách lô
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      // Invalidate inventory cache vì số lượng thay đổi
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

/**
 * Hook để cập nhật lô thuốc
 */
export function useUpdateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBatchBody }) =>
      batchesApi.updateBatch(id, body),
    onSuccess: () => {
      // Update detail cache
      queryClient.invalidateQueries({ queryKey: ['batch', 'detail'] });
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      // Invalidate inventory cache
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

/**
 * Hook để xóa lô thuốc
 */
export function useDeleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => batchesApi.deleteBatch(id),
    onSuccess: () => {
      // Invalidate cache để refetch danh sách
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
