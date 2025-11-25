// src/features/warehouse/hooks/useInventory.ts

import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@features/warehouse/api/inventory.api';
import { GetInventoryQuery } from '@features/warehouse/types/inventory.types';

/**
 * Hook để lấy danh sách tồn kho theo chi nhánh
 * Sử dụng React Query để cache và auto-refetch
 */
export function useGetInventoryByBranch(
  branchId: string,
  query?: GetInventoryQuery,
) {
  return useQuery({
    queryKey: ['inventory', 'branch', branchId, query],
    queryFn: () => inventoryApi.getInventoryByBranch(branchId, query),
    enabled: !!branchId, // Chỉ fetch khi có branchId
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy tồn kho toàn hệ thống (admin only)
 */
export function useGetAllInventory(query?: GetInventoryQuery) {
  return useQuery({
    queryKey: ['inventory', 'all', query],
    queryFn: () => inventoryApi.getAllInventory(query),
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy tồn kho của 1 loại thuốc tại chi nhánh
 */
export function useGetInventoryByBranchAndMedicine(
  branchId: string,
  medicineId: string,
) {
  return useQuery({
    queryKey: ['inventory', 'branch', branchId, 'medicine', medicineId],
    queryFn: () =>
      inventoryApi.getInventoryByBranchAndMedicine(branchId, medicineId),
    enabled: !!branchId && !!medicineId,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
}

/**
 * Hook để lấy chi tiết tồn kho bằng Inventory ID
 */
export function useGetInventoryDetail(id: string) {
  return useQuery({
    queryKey: ['inventory', 'detail', id],
    queryFn: () => inventoryApi.getInventoryDetail(id),
    enabled: !!id, // Chỉ fetch khi có id
  });
}

/**
 * Hook để lấy thống kê tồn kho theo chi nhánh
 */
export function useGetInventoryStats(branchId: string) {
  return useQuery({
    queryKey: ['inventory', 'stats', branchId],
    queryFn: () => inventoryApi.getInventoryStats(branchId),
    enabled: !!branchId, // Chỉ fetch khi có branchId
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}
