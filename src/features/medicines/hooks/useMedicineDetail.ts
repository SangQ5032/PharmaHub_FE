import { useEffect, useState, useCallback } from 'react';
import { fetchMedicineDetail } from '../services/medicineService';
import { Medicine } from '../types';

export function useMedicineDetail(medicineId?: string) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);

  const load = useCallback(async () => {
    if (!medicineId) {
      setMedicine(null);
      return;
    }

    console.log('[useMedicineDetail] load start, id:', medicineId);
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    try {
      const result = await fetchMedicineDetail(medicineId);
      console.log('[useMedicineDetail] load success');
      setMedicine(result);
    } catch (err: any) {
      console.error('[useMedicineDetail] load error:', err?.message ?? err);
      setError(err instanceof Error ? err.message : String(err));
      setErrorDetail({
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [medicineId]);

  // load on mount or when medicineId changes
  useEffect(() => {
    load();
  }, [load]);

  return {
    medicine,
    loading,
    error,
    errorDetail,
    refresh: load,
  };
}
