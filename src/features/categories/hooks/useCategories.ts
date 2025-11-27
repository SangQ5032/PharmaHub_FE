import { useCallback, useEffect, useMemo, useState } from 'react';
import { Category } from '../types';
import {
  listCategories,
  ListCategoriesParams,
} from '../services/categoriesService';

export type UseCategoriesOptions = {
  initialPage?: number;
  initialLimit?: number;
  initialSort?: string; // 'name_asc' | 'name_desc'
};

export function useCategories(options: UseCategoriesOptions = {}) {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<any>(null);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(options.initialPage ?? 1);
  const [limit, setLimit] = useState(options.initialLimit ?? 10);
  const [sort, setSort] = useState(options.initialSort ?? 'name_asc');

  const [total, setTotal] = useState<number | undefined>(undefined);

  const params: ListCategoriesParams = useMemo(
    () => ({ q: search.trim() || undefined, page, limit, sort }),
    [search, page, limit, sort],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    try {
      const res = await listCategories(params);
      setItems(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh mục');
      setErrorDetail({
        message: err?.message,
        responseStatus: err?.response?.status,
        responseData: err?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const h = setTimeout(() => {
      setPage(1); // reset page when search changes
      load();
    }, 300);
    return () => clearTimeout(h);
  }, [search, load]);

  const totalPages = useMemo(() => {
    if (!total || !limit) return undefined;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  return {
    items,
    loading,
    error,
    errorDetail,
    refresh: load,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    total,
    totalPages,
  };
}

export default useCategories;
