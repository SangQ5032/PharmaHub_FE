import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerById,
  getCustomerInvoices,
  createCustomer,
  CreateCustomerRequest,
  GetCustomersResponse,
  GetCustomerByIdResponse,
  GetCustomerInvoicesResponse,
} from '../api/customers.api';

export const useGetCustomers = (
  page: number = 1,
  limit: number = 20,
  q?: string,
) => {
  return useQuery<GetCustomersResponse>({
    queryKey: [
      'customers',
      page,
      limit,
      ...(q ? [q] : []), // chỉ thêm q vào queryKey khi có
    ],
    queryFn: () => getCustomers(page, limit, q),
  });
};

export const useGetCustomerById = (id: string) => {
  return useQuery<GetCustomerByIdResponse>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useGetCustomerInvoices = (
  customerId: string,
  page: number = 1,
  limit: number = 20,
) => {
  return useQuery<GetCustomerInvoicesResponse>({
    queryKey: ['customerInvoices', customerId, page, limit],
    queryFn: () => getCustomerInvoices(customerId, page, limit),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
  });
};
