/**
 * Work Schedule History Types
 * Định nghĩa các types cho API lấy lịch sử làm việc
 */

export type UserRole = 'employee' | 'branch_manager' | 'system_admin';
export type Shift = 'morning' | 'afternoon';

export interface UserInfo {
  _id: string;
  username: string;
  name: string;
  role: UserRole;
  contact?: {
    phone: string;
    email: string;
  };
}

export interface BranchInfo {
  _id: string;
  name: string;
  address: string;
  phone: string;
}

/**
 * Invoice Item Types
 */
export interface InvoiceItem {
  medicine_id:
    | string
    | {
        _id: string;
        name: string;
        unit: string;
        price: number;
        category: string;
      };
  batch_id:
    | string
    | {
        _id: string;
        batch_number: string;
        expiry_date: string;
      };
  name: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

/**
 * Invoice Types
 */
export interface InvoiceData {
  _id: string;
  invoice_code: string;
  branch_id: string;
  employee_id: string;
  customer_id?:
    | string
    | {
        _id: string;
        name: string;
        phone: string;
        address: string;
      };
  customer_name?: string;
  customer_phone?: string;
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
}

export interface WorkScheduleHistoryRecord {
  note: any;
  _id: string;
  user_id: UserInfo;
  branch_id: BranchInfo;
  checkin_time: string; // ISO 8601 format - Thời gian check-in thực tế
  checkout_time: string | null; // ISO 8601 format - Thời gian check-out (null nếu chưa checkout)
  working_hours: number; // Số giờ làm việc tính toán
  status: 'checked_in' | 'checked_out' | 'late' | 'early' | 'absent'; // Trạng thái attendance
  date: string; // YYYY-MM-DD format - Ngày làm việc
  shift: Shift; // Ca làm việc xác định từ giờ check-in
  scheduledShift?: {
    _id: string;
    date: string;
    shift: Shift;
  }; // Thông tin lịch được giao (null nếu không có lịch)
  isOnSchedule: boolean; // True nếu nhân viên có lịch vào ngày/ca đó
  // Invoice related fields (từ API chi tiết)
  invoiceCount?: number; // Tổng số hoá đơn trong ca
  invoiceSummary?: {
    totalAmount: number; // Tổng tiền (VND)
    totalItems: number; // Tổng số sản phẩm
  };
  invoices?: InvoiceData[]; // Danh sách chi tiết hoá đơn
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  __v?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Response Types
 */
export interface WorkScheduleHistoryResponse<T = WorkScheduleHistoryRecord[]> {
  success: boolean;
  message: string;
  data: T;
  pagination: PaginationInfo;
}

/**
 * Query Parameters Types
 */
export interface WorkScheduleHistoryParams {
  page?: number;
  limit?: number;
  from_date?: string; // YYYY-MM-DD
  to_date?: string; // YYYY-MM-DD
  search?: string; // YYYY-MM-DD - Tìm kiếm theo ngày cụ thể
  shift?: Shift;
  user_id?: string;
  branch_id?: string; // Only for system_admin
  status?: 'checked_in' | 'checked_out' | 'late' | 'early' | 'absent';
}

/**
 * Filter State for UI
 */
export interface WorkHistoryFilters {
  page: number;
  limit: number;
  fromDate?: string;
  toDate?: string;
  search?: string; // Tìm kiếm theo ngày cụ thể
  shift?: Shift;
  userId?: string; // For system_admin to filter by specific employee
  branchId?: string; // For system_admin to filter by specific branch
  status?: 'checked_in' | 'checked_out' | 'late' | 'early' | 'absent';
}

/**
 * Error Response Type
 */
export interface WorkScheduleHistoryErrorResponse {
  success: false;
  message: string;
}
