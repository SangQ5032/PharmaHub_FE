// src/features/warehouse/hooks/useInventory.ts

import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@features/warehouse/api/inventory.api';
import {
  GetInventoryQuery,
  GetBatchesQuery,
} from '@features/warehouse/types/inventory.types';

/**
 * Hook lấy danh sách thuốc + lô hàng chi tiết (tổng hợp)
 * API: GET /api/batches/medicines-with-batches/by-branch/:branchId
 */
export function useGetMedicinesWithBatches(
  branchId: string,
  query?: GetBatchesQuery,
) {
  return useQuery({
    queryKey: ['inventory', 'medicines-batches', branchId, query],
    queryFn: () => inventoryApi.getMedicinesWithBatches(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy tất cả lô hàng của chi nhánh
 * API: GET /api/batches/branch/:branchId
 */
export function useGetAllBatches(branchId: string, query?: GetBatchesQuery) {
  return useQuery({
    queryKey: ['inventory', 'all-batches', branchId, query],
    queryFn: () => inventoryApi.getAllBatches(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy lô hàng của thuốc tại chi nhánh
 * API: GET /api/batches/branch/:branchId/medicine/:medicineId
 */
export function useGetBatchesByMedicine(branchId: string, medicineId: string) {
  return useQuery({
    queryKey: ['inventory', 'batches', branchId, medicineId],
    queryFn: () => inventoryApi.getBatchesByMedicine(branchId, medicineId),
    enabled: !!branchId && !!medicineId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy chi tiết 1 lô hàng
 * API: GET /api/batches/:id
 */
export function useGetBatchDetail(id: string) {
  return useQuery({
    queryKey: ['inventory', 'batch-detail', id],
    queryFn: () => inventoryApi.getBatchDetail(id),
    enabled: !!id,
  });
}

/**
 * Hook lấy danh sách tồn kho theo chi nhánh
 * API: GET /api/branches/:branchId/inventory
 */
export function useGetInventoryByBranch(
  branchId: string,
  query?: GetInventoryQuery,
) {
  return useQuery({
    queryKey: ['inventory', 'branch', branchId, query],
    queryFn: () => inventoryApi.getInventoryByBranch(branchId, query),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy tồn kho của 1 loại thuốc tại chi nhánh (chi tiết)
 * API: GET /api/inventory/branch/:branchId/medicine/:medicineId
 */
export function useGetInventoryMedicineDetail(
  branchId: string,
  medicineId: string,
) {
  return useQuery({
    queryKey: ['inventory', 'medicine-detail', branchId, medicineId],
    queryFn: () =>
      inventoryApi.getInventoryMedicineDetail(branchId, medicineId),
    enabled: !!branchId && !!medicineId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy danh sách batch cho hóa đơn
 * API: GET /api/inventory/branch/:branchId/medicine/:medicineId/batches
 */
export function useGetBatchesForInvoice(branchId: string, medicineId: string) {
  return useQuery({
    queryKey: ['inventory', 'batches-invoice', branchId, medicineId],
    queryFn: () => inventoryApi.getBatchesForInvoice(branchId, medicineId),
    enabled: !!branchId && !!medicineId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy chi tiết tồn kho bằng Inventory ID
 * API: GET /api/inventory/:inventoryId
 */
export function useGetInventoryDetail(id: string) {
  return useQuery({
    queryKey: ['inventory', 'detail', id],
    queryFn: () => inventoryApi.getInventoryDetail(id),
    enabled: !!id,
  });
}

/**
 * Hook lấy tồn kho toàn hệ thống (admin only)
 * API: GET /api/inventory
 */
export function useGetAllInventory(query?: GetInventoryQuery) {
  return useQuery({
    queryKey: ['inventory', 'all', query],
    queryFn: () => inventoryApi.getAllInventory(query),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook lấy thống kê tồn kho theo chi nhánh
 * API: GET /api/branches/:branchId/inventory/stats
 */
export function useGetInventoryStats(branchId: string) {
  return useQuery({
    queryKey: ['inventory', 'stats', branchId],
    queryFn: () => inventoryApi.getInventoryStats(branchId),
    enabled: !!branchId,
    staleTime: 1000 * 60 * 10,
  });
}
