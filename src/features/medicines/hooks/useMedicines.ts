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
      const data = await fetchMedicines(q || undefined, {
        page: 1,
        limit: 100,
      });
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
  }, [search]);

  // initial load
  useEffect(() => {
    load();
  }, [load]);

  // debounce search input -> realtime fetch theo tên
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
