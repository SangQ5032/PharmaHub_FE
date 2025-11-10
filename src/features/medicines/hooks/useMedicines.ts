import { useEffect, useState, useCallback } from 'react';
import { fetchMedicines } from '../services/medicineService';
import { Medicine } from '../types';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);

  const load = useCallback(async () => {
    console.log('[useMedicines] load start');
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    try {
      const data = await fetchMedicines();
      console.log(
        '[useMedicines] load success, count =',
        Array.isArray(data) ? data.length : 'not-array',
      );
      setMedicines(data);
    } catch (err: any) {
      console.error('[useMedicines] load error:', err?.message ?? err);
      setError(err instanceof Error ? err.message : String(err));
      // capture extra details if available
      setErrorDetail({
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { medicines, loading, error, errorDetail, refresh: load };
}
