import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  getInvoicesByBranch,
  getInvoicesByMe,
  scanBarcode,
} from '../api/sales.api';
import { CreateInvoiceRequest, CreateInvoiceResponse } from '../types';

export const useCreateInvoice = () => {
  return useMutation<CreateInvoiceResponse, Error, CreateInvoiceRequest>({
    mutationFn: createInvoice,
  });
};

/**
 * Scan barcode để lấy thông tin thuốc
 */
export const useScanBarcode = () => {
  return useMutation({
    mutationFn: (barcode: string) => scanBarcode(barcode),
  });
};

/**
 * Lấy danh sách hoá đơn của toàn bộ chi nhánh hoặc chi nhánh chỉ định
 */
export const useGetInvoicesByBranch = (params?: {
  page?: number;
  limit?: number;
  branch_id?: string;
  employee_id?: string;
  customer_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['invoices-branch', params],
    queryFn: () => getInvoicesByBranch(params),
  });
};

/**
 * Lấy danh sách hoá đơn của nhân viên hiện tại
 */
export const useGetInvoicesByMe = (params?: {
  page?: number;
  limit?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['invoices-me', params],
    queryFn: () => getInvoicesByMe(params),
  });
};

/**
 * Lấy danh sách hoá đơn (cũ - tương thích ngược)
 */
export const useGetInvoices = (limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['invoices', limit, offset],
    queryFn: () => getInvoices(limit, offset),
  });
};

/**
 * Lấy chi tiết hoá đơn
 */
export const useGetInvoiceById = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
};
