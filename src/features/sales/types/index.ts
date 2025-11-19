export type SaleItem = {
  medicine_id: string;
  quantity: number;
  unit_price: number;
};

export type CreateInvoiceRequest = {
  items: SaleItem[];
  discount: number;
  tax_rate: number;
  payment_method: 'cash' | 'card' | 'transfer';
  customer_id?: string; // Optional: nếu chọn từ database
  customer_name: string;
  customer_phone: string;
  note?: string;
};

export type MedicineInfo = {
  _id: string;
  name: string;
  unit?: string;
  price?: number;
};

export type InvoiceItem = {
  medicine_id: MedicineInfo;
  name: string;
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
  total_spent: number;
};

export type Invoice = {
  _id: string;
  invoice_code: string;
  branch_id: BranchInfo;
  employee_id: EmployeeInfo;
  customer_id: CustomerInfo;
  customer_name: string;
  customer_phone: string;
  payment_method: 'cash' | 'card' | 'transfer';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  note?: string;
  status: 'completed' | 'pending' | 'cancelled';
  exported: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateInvoiceResponse = {
  success: boolean;
  message: string;
  data: Invoice;
};
