import { useQuery } from '@tanstack/react-query';
import {
  getMedicines,
  getMedicinesByBranch,
  getMedicinesWithBatches,
  getBatchesByMedicineAndBranch,
  Batch,
} from '../api/medicines.api';

export const useMedicines = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['medicines', limit, offset],
    queryFn: () => getMedicines(limit, offset),
  });
};

export const useMedicinesByBranch = (branchId: string) => {
  return useQuery({
    queryKey: ['medicines_branch', branchId],
    queryFn: () => getMedicinesByBranch(branchId),
    enabled: !!branchId,
  });
};

export const useMedicinesWithBatches = (
  branchId: string,
  page: number = 1,
  limit: number = 10,
  sortParams?: any,
) => {
  return useQuery({
    queryKey: ['medicines_with_batches', branchId, page, limit, sortParams],
    queryFn: () => getMedicinesWithBatches(branchId, page, limit, sortParams),
    enabled: !!branchId,
  });
};

/**
 * Lấy danh sách batch của một thuốc tại chi nhánh
 * Sắp xếp theo ngày hết hạn (sớm nhất trước - FIFO)
 */
export const useGetBatches = (branchId: string, medicineId: string) => {
  return useQuery({
    queryKey: ['batches', branchId, medicineId],
    queryFn: async () => {
      const batches = await getBatchesByMedicineAndBranch(branchId, medicineId);
      // Sắp xếp theo ngày hết hạn (sớm nhất trước)
      return batches.sort((a, b) => {
        return (
          new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
        );
      });
    },
    enabled: !!branchId && !!medicineId,
  });
};
