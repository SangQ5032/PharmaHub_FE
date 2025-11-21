import api from '@shared/services/api';
import { CreateInvoiceRequest, CreateInvoiceResponse } from '../types';

const SALES_ENDPOINT = '/sales';
const INVOICES_ENDPOINT = '/sales/invoices';

export const createInvoice = async (
  data: CreateInvoiceRequest,
): Promise<CreateInvoiceResponse> => {
  const response = await api.post<CreateInvoiceResponse>(
    `${SALES_ENDPOINT}`,
    data,
  );
  return response.data;
};

/**
 * Lấy danh sách hoá đơn của toàn bộ chi nhánh
 * API: GET /api/sales/invoices/branch
 */
export const getInvoicesByBranch = async (params?: {
  page?: number;
  limit?: number;
  employee_id?: string;
  customer_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}): Promise<any> => {
  const response = await api.get(`${INVOICES_ENDPOINT}/branch`, {
    params,
  });
  return response.data;
};

/**
 * Lấy danh sách hoá đơn của nhân viên hiện tại
 * API: GET /api/sales/invoices/me
 */
export const getInvoicesByMe = async (params?: {
  page?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
}): Promise<any> => {
  const response = await api.get(`${INVOICES_ENDPOINT}/me`, {
    params,
  });
  return response.data;
};

/**
 * Lấy danh sách hoá đơn (cũ - tương thích ngược)
 */
export const getInvoices = async (
  limit?: number,
  offset?: number,
): Promise<any> => {
  const response = await api.get(`${SALES_ENDPOINT}`, {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};

/**
 * Lấy chi tiết hoá đơn
 * API: GET /api/sales/invoices/:id
 */
export const getInvoiceById = async (id: string): Promise<any> => {
  const response = await api.get(`${INVOICES_ENDPOINT}/${id}`);
  return response.data;
};
