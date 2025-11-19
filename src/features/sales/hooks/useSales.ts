import { useMutation, useQuery } from '@tanstack/react-query';
import { createInvoice, getInvoices, getInvoiceById } from '../api/sales.api';
import { CreateInvoiceRequest, CreateInvoiceResponse } from '../types';

export const useCreateInvoice = () => {
  return useMutation<CreateInvoiceResponse, Error, CreateInvoiceRequest>({
    mutationFn: createInvoice,
  });
};

export const useGetInvoices = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['invoices', limit, offset],
    queryFn: () => getInvoices(limit, offset),
  });
};

export const useGetInvoiceById = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
};
