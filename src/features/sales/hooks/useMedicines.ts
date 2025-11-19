import { useQuery } from '@tanstack/react-query';
import { getMedicines } from '../api/medicines.api';

export const useMedicines = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['medicines', limit, offset],
    queryFn: () => getMedicines(limit, offset),
  });
};
