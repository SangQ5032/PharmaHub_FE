// src/features/warehouse/hooks/useSuppliers.ts

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@features/warehouse/api/suppliers.api';
import { GetSuppliersQuery } from '@features/warehouse/types/supplier.types';

/**
 * Hook để lấy danh sách nhà cung cấp
 * Sử dụng React Query để cache và auto-refetch
 * Mặc định filter theo status: 'active'
 */
export function useGetSuppliers(query?: GetSuppliersQuery) {
  return useQuery({
    queryKey: ['suppliers', query],
    queryFn: () =>
      suppliersApi.getSuppliers({
        status: 'active', // Mặc định chỉ hiển thị nhà cung cấp hoạt động
        ...query,
      }),
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}

/**
 * Hook để lấy danh sách nhà cung cấp hoạt động
 */
export function useGetActiveSuppliers() {
  return useQuery({
    queryKey: ['suppliers-active'],
    queryFn: () => suppliersApi.getActiveSuppliers(),
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}
