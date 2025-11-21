import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import branchApi from '../api/branch.api';

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await branchApi.getBranches();
      return res.data ?? res;
    },
  });
}

export function useBranch(id?: string) {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await branchApi.getBranchById(id);
      return res.data ?? res;
    },
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => branchApi.createBranch(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      branchApi.updateBranch(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  });
}
