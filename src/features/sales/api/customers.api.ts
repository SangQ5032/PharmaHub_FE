import api from '@shared/services/api';

const CUSTOMERS_ENDPOINT = '/customers';

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  total_spent?: number;
  created_at?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetCustomersResponse = {
  success: boolean;
  message: string;
  data: Customer[];
  pagination: Pagination;
};

export type GetCustomerByIdResponse = {
  success: boolean;
  message: string;
  data: Customer;
};

export type CreateCustomerRequest = {
  name: string;
  phone: string;
  address?: string;
  email?: string;
};

export type CreateCustomerResponse = {
  success: boolean;
  message: string;
  data: Customer;
};

export const getCustomers = async (
  page: number = 1,
  limit: number = 20,
  q?: string,
): Promise<Customer[]> => {
  const response = await api.get<GetCustomersResponse>(CUSTOMERS_ENDPOINT, {
    params: {
      page,
      limit,
      ...(q ? { q } : {}), // chỉ thêm q nếu có
    },
  });

  return response.data.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await api.get<GetCustomerByIdResponse>(
    `${CUSTOMERS_ENDPOINT}/${id}`,
  );
  return response.data.data;
};

export const createCustomer = async (
  data: CreateCustomerRequest,
): Promise<Customer> => {
  const response = await api.post<CreateCustomerResponse>(
    CUSTOMERS_ENDPOINT,
    data,
  );
  return response.data.data;
};
