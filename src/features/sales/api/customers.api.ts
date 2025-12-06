import api from '@shared/services/api';

const CUSTOMERS_ENDPOINT = '/customers';

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  total_spent?: number;
  createdAt?: string;
  updatedAt?: string;
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

// Invoice Types
export type InvoiceItem = {
  medicine_id: {
    _id: string;
    name: string;
  };
  batch_id: string;
  name: string;
  batch_number: string;
  quantity: number;
  unit: 'box' | 'blister' | 'tablet';
  total_base_units?: number;
  unit_price: number;
  line_total: number;
};

export type Invoice = {
  _id: string;
  invoice_code: string;
  branch_id: {
    _id: string;
    name: string;
  };
  employee_id: {
    _id: string;
    name: string;
  };
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  payment_method: 'cash' | 'card' | 'bank' | 'e-wallet';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  exported: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetCustomerInvoicesResponse = {
  success: boolean;
  message: string;
  data: Invoice[];
  pagination: Pagination;
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
): Promise<GetCustomersResponse> => {
  const response = await api.get<GetCustomersResponse>(CUSTOMERS_ENDPOINT, {
    params: {
      page,
      limit,
      ...(q ? { q } : {}), // chỉ thêm q nếu có
    },
  });

  return response.data;
};

export const getCustomerById = async (
  id: string,
): Promise<GetCustomerByIdResponse> => {
  const response = await api.get<GetCustomerByIdResponse>(
    `${CUSTOMERS_ENDPOINT}/${id}`,
  );
  return response.data;
};

export const getCustomerInvoices = async (
  customerId: string,
  page: number = 1,
  limit: number = 20,
): Promise<GetCustomerInvoicesResponse> => {
  const response = await api.get<GetCustomerInvoicesResponse>(
    `${CUSTOMERS_ENDPOINT}/${customerId}/invoices`,
    {
      params: {
        page,
        limit,
      },
    },
  );
  return response.data;
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
