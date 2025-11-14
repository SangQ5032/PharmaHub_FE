import { BranchRevenue, RevenueOverview } from '../types';

export const FAKE_OVERVIEW: RevenueOverview = {
  totalRevenue: 42350000,
  totalInvoices: 1240,
  paymentRate: 63.7,
  startDate: '01/10/2025',
  endDate: '21/10/2025',
};

export const FAKE_BRANCHES: BranchRevenue[] = [
  {
    id: '1',
    name: 'Chi nhánh Quận 1',
    address: '123 Lê Lợi, Q.1',
    revenue: 3250000,
    invoiceCount: 45,
    paymentRate: 68.5,
  },
  {
    id: '2',
    name: 'Chi nhánh Quận 3',
    address: '77 Nguyễn Đình Chiểu',
    revenue: 2800000,
    invoiceCount: 38,
    paymentRate: 72.3,
  },
  {
    id: '3',
    name: 'Chi nhánh Thủ Đức',
    address: '456 Võ Văn Ngân',
    revenue: 4150000,
    invoiceCount: 52,
    paymentRate: 65.8,
  },
  {
    id: '4',
    name: 'Chi nhánh Tân Bình',
    address: '89 Lý Thường Kiệt',
    revenue: 3850000,
    invoiceCount: 47,
    paymentRate: 70.2,
  },
  {
    id: '5',
    name: 'Chi nhánh Bình Thạnh',
    address: '234 Xô Viết Nghệ Tĩnh',
    revenue: 3600000,
    invoiceCount: 41,
    paymentRate: 67.9,
  },
];
