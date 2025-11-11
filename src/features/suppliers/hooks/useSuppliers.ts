import { useCallback, useEffect, useState } from 'react';
import { fetchSuppliers } from '../services/supplierService';
import { Supplier } from '../types';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = search.trim();
      const data = await fetchSuppliers(q || undefined);
      setSuppliers(data);
    } catch (err: any) {
      setError(err?.message ?? 'Lỗi tải nhà cung cấp');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const h = setTimeout(() => load(), 300);
    return () => clearTimeout(h);
  }, [search, load]);

  return { suppliers, loading, error, refresh: load, search, setSearch };
}
