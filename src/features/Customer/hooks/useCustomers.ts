// Customer/Customer/hooks/useCustomers.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { customerService } from '../services/CustomerService';
import { Customer } from '../types/customer';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (e) {
      setError('Không tải được danh sách khách hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  // load lần đầu
  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return customers;

    return customers.filter(item => {
      const name = (item.name || '').toLowerCase();
      const phone = item.phone || '';
      const code = (item.code || '').toLowerCase();

      return name.includes(key) || phone.includes(key) || code.includes(key);
    });
  }, [customers, search]);

  return {
    customers: filtered,
    loading,
    error,
    search,
    setSearch,
    reload: loadData,
  };
};
