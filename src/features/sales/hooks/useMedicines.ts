import { useQuery } from '@tanstack/react-query';
import { getMedicines, getMedicinesByBranch } from '../api/medicines.api';

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
