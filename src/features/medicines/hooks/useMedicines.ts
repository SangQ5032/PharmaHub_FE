import { useEffect, useState, useCallback } from 'react';
import { fetchMedicines } from '../services/medicineService';
import { Medicine } from '../types';

export function useMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);
  const [search, setSearch] = useState<string>('');

  const load = useCallback(async () => {
    console.log('[useMedicines] load start');
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    try {
      const q = search.trim();
      const result = await fetchMedicines({
        page: 1,
        limit: 100,
        name: q || undefined,
      });
      console.log(
        '[useMedicines] load success, count =',
        result.medicines.length,
      );
      setMedicines(result.medicines);
    } catch (err: any) {
      console.error('[useMedicines] load error:', err?.message ?? err);
      setError(err instanceof Error ? err.message : String(err));
      setErrorDetail({
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [search]);

  // initial load
  useEffect(() => {
    load();
  }, [load]);

  // debounce search input
  useEffect(() => {
    const h = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(h);
  }, [search, load]);

  return {
    medicines,
    loading,
    error,
    errorDetail,
    refresh: load,
    search,
    setSearch,
  };
}
