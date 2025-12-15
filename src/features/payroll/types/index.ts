// Contact info for user
export interface Contact {
  phone: string;
  email: string;
}

// User object (used in payroll responses)
export interface PayrollUser {
  _id: string;
  name: string;
  username: string;
  fullName?: string;
  phone?: string;
  email?: string;
  contact?: Contact;
  id?: string;
}

// Branch object (used in payroll responses)
export interface PayrollBranch {
  _id: string;
  name: string;
  address: string;
}

// Payroll status types
export type PayrollStatus = 'pending' | 'approved' | 'rejected';

// Payroll preview data (from GET /preview endpoint)
export interface PayrollPreview {
  user_id: string;
  branch_id: string;
  month: string;
  base_monthly_salary: number; // Lương cơ bản chuẩn theo tháng (26 công/26 ca)
  base_salary: number; // Lương cơ bản đã tính theo số ca thực tế
  total_shifts: number; // Tổng số ca được giao trong tháng
  completed_shifts: number; // Số ca đã chấm công
  missed_shifts: number; // Số ca được giao nhưng không checkin
  late_count: number; // Số ca đi muộn
  late_penalty_amount: number; // Phạt đi muộn
  missed_penalty_amount: number; // Phạt không đi làm
  penalty_amount: number; // Tổng phạt (muộn + không đi làm)
  bonus_amount: number; // Thưởng (nếu có)
  sales_amount: number; // Doanh số bán hàng trong tháng
  final_salary: number; // Lương cuối cùng sau khi trừ phạt
  status: PayrollStatus;
  note: string;
}

// Create payroll request
export interface CreatePayrollRequest {
  user_id: string;
  branch_id: string;
  month: string;
  base_salary: number;
  bonus_amount?: number;
  note?: string;
}

// Update payroll request
export interface UpdatePayrollRequest {
  bonus_amount?: number;
  note?: string;
}

// Approve payroll request
export interface ApprovePayrollRequest {
  note?: string;
}

// Reject payroll request
export interface RejectPayrollRequest {
  reason?: string;
}

// Payroll detail object
export interface PayrollDetail {
  _id: string;
  user_id: PayrollUser | string;
  branch_id: PayrollBranch | string;
  month: string;
  base_salary: number;
  working_days?: number; // Số ngày làm việc thực tế
  standard_working_days?: number; // Số ngày công chuẩn (26 ngày)
  total_shifts: number;
  completed_shifts: number;
  late_count: number;
  penalty_amount: number;
  bonus_amount: number;
  sales_amount: number;
  final_salary: number;
  status: PayrollStatus;
  note: string;
  approved_by: PayrollUser | string | null;
  approved_at: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// List payroll query filters
export interface ListPayrollFilters {
  branch_id?: string;
  month?: string;
  status?: PayrollStatus;
  user_id?: string;
  page?: number;
  limit?: number;
}

// Branch payroll summary
export interface BranchPayrollSummary {
  total_payroll: number;
  count: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
}
