export type SaleItem = {
  medicine_id: string;
  quantity: number;
  unit_price: number;
};

export type CreateInvoiceRequest = {
  branch_id: string; // Chi nhánh bắt buộc
  customer_name: string; // Tên khách hàng
  items: SaleItem[];
  payment_method?: 'cash' | 'card' | 'bank' | 'e-wallet';
  discount?: number;
  tax_rate?: number;
  customer_phone?: string;
  note?: string;
};

export type MedicineInfo = {
  _id: string;
  name: string;
  unit?: string;
  price?: number;
};

export type BatchInfo = {
  _id: string;
  batch_number: string;
  expiry_date: string;
};

export type InvoiceItem = {
  medicine_id: MedicineInfo;
  batch_id: BatchInfo;
  name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type BranchInfo = {
  _id: string;
  name: string;
  address: string;
  phone: string;
};

export type EmployeeInfo = {
  _id: string;
  username: string;
  name: string;
};

export type CustomerInfo = {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  total_spent: number;
};
export type Invoice = {
  _id: string;
  invoice_code: string;
  branch_id: BranchInfo;
  employee_id: EmployeeInfo;
  customer_id?: CustomerInfo;
  customer_name?: string;
  customer_phone?: string;
  payment_method: 'cash' | 'card' | 'transfer' | 'e-wallet';
  items: InvoiceItem[];
  subtotal: number;
  discount?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount: number;
  note?: string;
  status: 'completed' | 'pending' | 'cancelled';
  exported?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoiceResponse = {
  success: boolean;
  message: string;
  data: Invoice;
};
