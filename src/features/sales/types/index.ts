export type SaleItem = {
  medicine_id: string;
  quantity: number;
  unit: 'box' | 'blister' | 'tablet';
  unit_price?: number; // Optional, sẽ được tính từ medicine prices
  batch_id?: string; // Optional, bắt buộc cho employee role
  batch_number?: string; // Optional, để hiển thị trong UI
};

export type CreateInvoiceRequest = {
  branch_id: string; // Chi nhánh bắt buộc
  customer_name: string; // Tên khách hàng
  items: {
    medicine_id: string;
    quantity: number;
    unit: 'box' | 'blister' | 'tablet';
    batch_id?: string; // Optional, bắt buộc cho employee role
  }[];
  payment_method?: 'cash' | 'card' | 'bank' | 'e-wallet';
  discount?: number;
  tax_rate?: number;
  customer_phone?: string;
  customer_id?: string;
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
  batch_id?: BatchInfo; // Optional, FEFO tự động chọn
  name: string;
  batch_number?: string;
  quantity: number;
  unit?: 'box' | 'blister' | 'tablet';
  total_base_units?: number; // Số lượng đã convert sang base unit
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
