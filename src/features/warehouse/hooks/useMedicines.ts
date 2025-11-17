// src/features/warehouse/hooks/useMedicines.ts

import { useQuery } from '@tanstack/react-query';
import { medicinesApi } from '@features/warehouse/api/medicines.api';
import { GetMedicinesQuery } from '@features/warehouse/types/medicine.types';

/**
 * Hook để lấy danh sách thuốc
 * Sử dụng React Query để cache và auto-refetch
 */
export function useGetMedicines(query?: GetMedicinesQuery) {
  return useQuery({
    queryKey: ['medicines', query],
    queryFn: () => medicinesApi.getMedicines(query),
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
}
