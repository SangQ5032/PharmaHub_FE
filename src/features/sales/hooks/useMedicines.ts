import { useQuery } from '@tanstack/react-query';
import {
  getMedicines,
  getMedicinesByBranch,
  getMedicinesWithBatches,
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
