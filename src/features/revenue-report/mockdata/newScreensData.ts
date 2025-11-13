import type {
  WorkHistory,
  WorkHistorySummary,
  EmployeeRevenue,
  DailyRevenue,
  RevenueStats,
  Medicine,
  MedicineCategory,
  MedicineStats,
} from '../types';
import { FAKE_EMPLOYEES } from './employeeData';

// Helper function to generate daily revenue for an employee
const generateDailyRevenues = (totalRevenue: number): DailyRevenue[] => {
  const days = 13; // 13 days in current month so far
  const revenues: DailyRevenue[] = [];
  let remaining = totalRevenue;

  for (let i = 1; i <= days; i++) {
    const isLastDay = i === days;
    const revenue = isLastDay
      ? remaining
      : Math.floor(Math.random() * (totalRevenue / days) * 1.5);
    remaining -= revenue;
    revenues.push({
      date: `${String(i).padStart(2, '0')}/11`,
      revenue: Math.max(0, revenue),
      invoiceCount: Math.floor(Math.random() * 20) + 5,
    });
  }
  return revenues;
};

// Function to get employee revenue by ID
export const getEmployeeRevenueById = (
  employeeId: string,
): EmployeeRevenue | null => {
  const employee = FAKE_EMPLOYEES.find(emp => emp.id === employeeId);
  if (!employee) return null;

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    avatar: employee.avatar,
    role: employee.role,
    period: 'Tháng 11/2025',
    totalRevenue: employee.totalRevenue || 0,
    totalInvoices: employee.totalInvoices || 0,
    commission: employee.commission || 0,
    commissionRate: employee.commissionRate || 0,
    targetRevenue: employee.targetRevenue || 0,
    achievementRate: employee.achievementRate || 0,
    dailyRevenues: generateDailyRevenues(employee.totalRevenue || 0),
  };
};

// ========== WORK HISTORY DATA ==========
export const FAKE_WORK_HISTORY: WorkHistory[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '13/11/2025',
    checkInTime: '08:00',
    checkOutTime: '17:30',
    totalHours: 9.5,
    status: 'on-time',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
    notes: 'Làm việc bình thường',
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '12/11/2025',
    checkInTime: '08:15',
    checkOutTime: '17:00',
    totalHours: 8.75,
    status: 'late',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
    notes: 'Đến muộn 15 phút',
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '11/11/2025',
    checkInTime: '07:55',
    checkOutTime: '17:10',
    totalHours: 9.25,
    status: 'on-time',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
  },
  {
    id: '4',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '10/11/2025',
    checkInTime: '08:00',
    checkOutTime: undefined,
    totalHours: 0,
    status: 'working',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
    notes: 'Đang làm việc',
  },
  {
    id: '5',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '09/11/2025',
    checkInTime: '-',
    checkOutTime: '-',
    totalHours: 0,
    status: 'absent',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
    notes: 'Nghỉ phép',
  },
  {
    id: '6',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '08/11/2025',
    checkInTime: '08:05',
    checkOutTime: '17:20',
    totalHours: 9.25,
    status: 'on-time',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
  },
  {
    id: '7',
    employeeId: '1',
    employeeName: 'Nguyễn Văn An',
    date: '07/11/2025',
    checkInTime: '08:30',
    checkOutTime: '17:00',
    totalHours: 8.5,
    status: 'late',
    shift: 'morning',
    location: 'Chi nhánh Quận 1',
    notes: 'Đến muộn 30 phút',
  },
];

export const FAKE_WORK_SUMMARY: WorkHistorySummary = {
  totalDays: 20,
  onTimeDays: 16,
  lateDays: 3,
  absentDays: 1,
  totalHours: 172.5,
  averageHours: 8.6,
};

// ========== EMPLOYEE REVENUE DATA ==========
export const FAKE_DAILY_REVENUES: DailyRevenue[] = [
  { date: '01/11', revenue: 2500000, invoiceCount: 8 },
  { date: '02/11', revenue: 3200000, invoiceCount: 12 },
  { date: '03/11', revenue: 1800000, invoiceCount: 6 },
  { date: '04/11', revenue: 4100000, invoiceCount: 15 },
  { date: '05/11', revenue: 3500000, invoiceCount: 11 },
  { date: '06/11', revenue: 2900000, invoiceCount: 9 },
  { date: '07/11', revenue: 3800000, invoiceCount: 14 },
  { date: '08/11', revenue: 4500000, invoiceCount: 16 },
  { date: '09/11', revenue: 3100000, invoiceCount: 10 },
  { date: '10/11', revenue: 3700000, invoiceCount: 13 },
  { date: '11/11', revenue: 4200000, invoiceCount: 15 },
  { date: '12/11', revenue: 3900000, invoiceCount: 12 },
  { date: '13/11', revenue: 4800000, invoiceCount: 18 },
];

export const FAKE_EMPLOYEE_REVENUE: EmployeeRevenue = {
  employeeId: '1',
  employeeName: 'Nguyễn Văn An',
  avatar: undefined,
  role: 'Thu ngân',
  period: 'Tháng 11/2025',
  totalRevenue: 46000000,
  totalInvoices: 159,
  commission: 2300000,
  commissionRate: 5,
  targetRevenue: 50000000,
  achievementRate: 92,
  dailyRevenues: FAKE_DAILY_REVENUES,
};

export const FAKE_REVENUE_STATS: RevenueStats = {
  thisMonth: 46000000,
  lastMonth: 42500000,
  growth: 8.2,
  topEmployee: 'Nguyễn Văn An',
  totalCommission: 2300000,
};

// ========== MEDICINE DATA ==========
export const FAKE_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    category: 'Thuốc giảm đau',
    manufacturer: 'Pharmacity',
    price: 25000,
    stock: 500,
    unit: 'Hộp',
    expiryDate: '12/2026',
    description: 'Thuốc giảm đau, hạ sốt',
    status: 'in-stock',
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    sku: 'MED002',
    category: 'Kháng sinh',
    manufacturer: 'Hasan Dermapharm',
    price: 85000,
    stock: 45,
    unit: 'Hộp',
    expiryDate: '06/2026',
    description: 'Kháng sinh điều trị nhiễm trùng',
    status: 'low-stock',
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    sku: 'MED003',
    category: 'Vitamin & Khoáng chất',
    manufacturer: 'DHG Pharma',
    price: 120000,
    stock: 0,
    unit: 'Hộp',
    expiryDate: '03/2026',
    description: 'Bổ sung vitamin C',
    status: 'out-of-stock',
  },
  {
    id: '4',
    name: 'Omeprazole 20mg',
    sku: 'MED004',
    category: 'Thuốc dạ dày',
    manufacturer: 'Teva Pharmaceutical',
    price: 65000,
    stock: 180,
    unit: 'Hộp',
    expiryDate: '09/2025',
    description: 'Điều trị loét dạ dày',
    status: 'expired',
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    sku: 'MED005',
    category: 'Thuốc giảm đau',
    manufacturer: 'Abbott',
    price: 42000,
    stock: 320,
    unit: 'Hộp',
    expiryDate: '11/2026',
    description: 'Thuốc chống viêm, giảm đau',
    status: 'in-stock',
  },
  {
    id: '6',
    name: 'Cefixime 200mg',
    sku: 'MED006',
    category: 'Kháng sinh',
    manufacturer: 'Boston Pharmaceuticals',
    price: 95000,
    stock: 140,
    unit: 'Hộp',
    expiryDate: '08/2026',
    description: 'Kháng sinh điều trị nhiễm khuẩn',
    status: 'in-stock',
  },
  {
    id: '7',
    name: 'Loratadine 10mg',
    sku: 'MED007',
    category: 'Thuốc dị ứng',
    manufacturer: 'Sanofi',
    price: 55000,
    stock: 38,
    unit: 'Hộp',
    expiryDate: '05/2026',
    description: 'Thuốc điều trị dị ứng',
    status: 'low-stock',
  },
  {
    id: '8',
    name: 'Metformin 500mg',
    sku: 'MED008',
    category: 'Thuốc tiểu đường',
    manufacturer: 'Merck',
    price: 78000,
    stock: 220,
    unit: 'Hộp',
    expiryDate: '12/2026',
    description: 'Điều trị đái tháo đường type 2',
    status: 'in-stock',
  },
  {
    id: '9',
    name: 'Amlodipine 5mg',
    sku: 'MED009',
    category: 'Thuốc tim mạch',
    manufacturer: 'Pfizer',
    price: 88000,
    stock: 165,
    unit: 'Hộp',
    expiryDate: '10/2026',
    description: 'Thuốc điều trị tăng huyết áp',
    status: 'in-stock',
  },
  {
    id: '10',
    name: 'Simvastatin 20mg',
    sku: 'MED010',
    category: 'Thuốc tim mạch',
    manufacturer: 'Stada',
    price: 92000,
    stock: 42,
    unit: 'Hộp',
    expiryDate: '07/2026',
    description: 'Thuốc giảm cholesterol',
    status: 'low-stock',
  },
];

export const FAKE_MEDICINE_CATEGORIES: MedicineCategory[] = [
  { id: '1', name: 'Tất cả', count: 10 },
  { id: '2', name: 'Thuốc giảm đau', count: 2 },
  { id: '3', name: 'Kháng sinh', count: 2 },
  { id: '4', name: 'Vitamin & Khoáng chất', count: 1 },
  { id: '5', name: 'Thuốc dạ dày', count: 1 },
  { id: '6', name: 'Thuốc dị ứng', count: 1 },
  { id: '7', name: 'Thuốc tiểu đường', count: 1 },
  { id: '8', name: 'Thuốc tim mạch', count: 2 },
];

export const FAKE_MEDICINE_STATS: MedicineStats = {
  total: 10,
  inStock: 5,
  lowStock: 3,
  outOfStock: 1,
  expired: 1,
  totalValue: 68750000,
};
