// src/features/warehouse/hooks/useSuppliers.ts

import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@features/warehouse/api/suppliers.api';
import { GetSuppliersQuery } from '@features/warehouse/types/supplier.types';

/**
 * Hook để lấy danh sách nhà cung cấp
 * Sử dụng React Query để cache và auto-refetch
 */
export function useGetSuppliers(query?: GetSuppliersQuery) {
  return useQuery({
    queryKey: ['suppliers', query],
    queryFn: () => suppliersApi.getSuppliers(query),
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}
