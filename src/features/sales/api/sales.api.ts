import api from '@shared/services/api';
import { CreateInvoiceRequest, CreateInvoiceResponse, Invoice } from '../types';

const SALES_ENDPOINT = '/sales';

export const createInvoice = async (
  data: CreateInvoiceRequest,
): Promise<CreateInvoiceResponse> => {
  const response = await api.post<CreateInvoiceResponse>(
    `${SALES_ENDPOINT}`,
    data,
  );
  return response.data;
};

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

export const getInvoiceById = async (id: string): Promise<any> => {
  const response = await api.get(`${SALES_ENDPOINT}/${id}`);
  return response.data;
};
