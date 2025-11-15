// Types cho feature báo cáo doanh thu theo chi nhánh

export interface BranchRevenue {
  id: string;
  name: string;
  address: string;
  revenue: number;
  invoiceCount: number;
  paymentRate: number;
}

export interface RevenueOverview {
  totalRevenue: number;
  totalInvoices: number;
  paymentRate: number;
  startDate: string;
  endDate: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'blocked';
  branchId: string;
  // Thông tin doanh thu
  totalRevenue?: number;
  totalInvoices?: number;
  commission?: number;
  commissionRate?: number;
  targetRevenue?: number;
  achievementRate?: number;
}

export interface EmployeeFilter {
  branchName: string;
  role: 'all' | 'staff' | 'manager';
  status: 'active' | 'inactive' | 'blocked' | 'all';
}

export interface BranchEmployeeStats {
  total: number;
  active: number;
  inactive: number;
}

export type SortBy = 'revenue' | 'invoiceCount' | 'paymentRate' | 'name';
export type SortOrder = 'asc' | 'desc';

// Types cho màn hình lịch sử làm việc nhân viên
export interface WorkHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours: number;
  status: 'on-time' | 'late' | 'absent' | 'working';
  shift: 'morning' | 'afternoon' | 'evening';
  location: string;
  notes?: string;
}

export interface WorkHistorySummary {
  totalDays: number;
  onTimeDays: number;
  lateDays: number;
  absentDays: number;
  totalHours: number;
  averageHours: number;
}

// Types cho màn hình doanh thu nhân viên
export interface EmployeeRevenue {
  employeeId: string;
  employeeName: string;
  avatar?: string;
  role: string;
  period: string;
  totalRevenue: number;
  totalInvoices: number;
  commission: number;
  commissionRate: number;
  targetRevenue: number;
  achievementRate: number;
  dailyRevenues: DailyRevenue[];
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueStats {
  thisMonth: number;
  lastMonth: number;
  growth: number;
  topEmployee: string;
  totalCommission: number;
}

// Types cho màn hình quản lý thuốc
export interface Medicine {
  id: string;
  name: string;
  sku: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  unit: string;
  expiryDate: string;
  description?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  image?: string;
}

export interface MedicineCategory {
  id: string;
  name: string;
  count: number;
}

export interface MedicineFilter {
  category: string;
  status: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
  priceRange: {
    min: number;
    max: number;
  };
}

export interface MedicineStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  expired: number;
  totalValue: number;
}

// Export statistics types
export * from './statistics.types';
