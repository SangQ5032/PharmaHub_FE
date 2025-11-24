import { useEffect, useState, useCallback } from 'react';
import { fetchMedicineInventoryAllBranches } from '../services/medicineService';
import { InventoryAllBranches } from '../types';

export function useMedicineInventory(medicineId: string) {
  const [inventory, setInventory] = useState<InventoryAllBranches | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    'branch_name' | 'total_quantity' | 'low_quantity'
  >('branch_name');

  const load = useCallback(async () => {
    if (!medicineId) {
      setInventory(null);
      return;
    }

    console.log(
      '[useMedicineInventory] load start - medicineId:',
      medicineId,
      'sortBy:',
      sortBy,
    );
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMedicineInventoryAllBranches(
        medicineId,
        sortBy,
      );
      console.log(
        '[useMedicineInventory] load success, branches count =',
        result.branches?.length ?? 0,
      );
      setInventory(result);
    } catch (err: any) {
      console.error('[useMedicineInventory] load error:', err?.message ?? err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [medicineId, sortBy]);

  // Load on mount and when medicineId or sortBy changes
  useEffect(() => {
    load();
  }, [load]);

  return {
    inventory,
    loading,
    error,
    refresh: load,
    sortBy,
    setSortBy,
  };
}
