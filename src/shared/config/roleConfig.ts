import { UserRole } from '@features/auth/types/types';
import { ROUTES } from '@shared/constants/routes';

export interface RoleOption {
  id: string;
  name: string;
  icon: string;
  route: string;
  description?: string;
}

export interface TabConfig {
  id: string;
  name: string;
  label: string;
  component?: string;
}

export interface RoleConfig {
  options: RoleOption[];
  tabs: TabConfig[];
}

// Config cho từng role - 3 option cho mỗi role + tabs
export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  'system-admin': {
    options: [
      {
        id: 'admin-1',
        name: 'Thống Kê Hệ Thống',
        icon: 'chart-box-multiple',
        route: ROUTES.SYSTEM_ADMIN_STATISTICS_MENU,
        description: 'Xem thống kê toàn hệ thống',
      },
      // {
      //   id: 'admin-2',
      //   name: 'Quản lý nhân viên',
      //   icon: 'account-group',
      //   route: ROUTES.EMPLOYEE_MANAGEMENT,
      //   description: 'Quản lý toàn bộ nhân viên',
      // },
      {
        id: 'admin-3',
        name: 'Báo cáo doanh thu',
        icon: 'chart-line',
        route: ROUTES.BRANCH_REVENUE_REPORT,
        description: 'Xem báo cáo doanh thu chi tiết',
      },
      {
        id: 'admin-4',
        name: 'Quản lý thuốc',
        icon: 'pill',
        route: ROUTES.MEDICINE_MANAGEMENT,
        description: 'Quản lý kho thuốc',
      },
      {
        id: 'admin-5',
        name: 'Quản lý chi nhánh',
        icon: 'office-building',
        route: ROUTES.BRANCH_LIST,
        description: 'Quản lý thông tin chi nhánh',
      },
      {
        id: 'admin-6',
        name: 'Quản lý lịch làm việc',
        icon: 'calendar-clock',
        route: ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_MENU,
        description: 'Quản lý lịch làm việc theo chi nhánh',
      },
      {
        id: 'admin-7',
        name: 'Lịch sử làm việc',
        icon: 'history',
        route: ROUTES.ADMIN_WORK_HISTORY,
        description: 'Xem lịch sử làm việc toàn hệ thống',
      },
      {
        id: 'admin-8',
        name: 'Quản lý lương',
        icon: 'cash-multiple',
        route: ROUTES.PAYROLL_MENU,
        description: 'Quản lý và duyệt lương nhân viên',
      },
      {
        id: 'admin-9',
        name: 'Quản lý khách hàng',
        icon: 'account-multiple',
        route: ROUTES.CUSTOMER_LIST,
        description: 'Quản lý danh sách khách hàng',
      },
    ],
    tabs: [
      {
        id: 'admin-tab-1',
        name: 'Home',
        label: 'Trang chủ',
      },
      {
        id: 'admin-tab-2',
        name: 'MedicinesHub',
        label: 'Medicines Hub',
      },
      // {
      //   id: 'admin-tab-3',
      //   name: 'ReportsHub',
      //   label: 'Reports',
      // },
    ],
  },
  'branch-manager': {
    options: [
      {
        id: 'manager-1',
        name: 'Lịch Làm Việc',
        icon: 'calendar',
        route: ROUTES.WORK_SCHEDULE_MENU,
        description: 'Quản lý lịch làm việc',
      },
      {
        id: 'manager-2',
        name: 'Lịch sử làm việc',
        icon: 'history',
        route: ROUTES.BRANCH_WORK_HISTORY,
        description: 'Xem lịch sử làm việc',
      },
      {
        id: 'manager-3',
        name: 'Báo cáo doanh thu',
        icon: 'chart-line',
        route: ROUTES.BRANCH_REVENUE_REPORT,
        description: 'Báo cáo doanh thu chi nhánh',
      },
      {
        id: 'manager-4',
        name: 'Kho Thuốc',
        icon: 'warehouse',
        route: ROUTES.WAREHOUSE_HUB,
        description: 'Quản lý tồn kho thuốc',
      },
      {
        id: 'manager-5',
        name: 'Nhập Hàng',
        icon: 'truck-delivery',
        route: ROUTES.IMPORT_LIST,
        description: 'Quản lý đơn nhập hàng',
      },
      {
        id: 'manager-7',
        name: 'Lịch sử hoá đơn',
        icon: 'file-document-outline',
        route: ROUTES.BRANCH_INVOICE_HISTORY,
        description: 'Xem lịch sử bán hàng',
      },
      {
        id: 'manager-8',
        name: 'Quản Lý Lương',
        icon: 'cash-multiple',
        route: ROUTES.PAYROLL_MENU,
        description: 'Quản lý bảng lương nhân viên',
      },
      {
        id: 'manager-9',
        name: 'Thống Kê Chi Nhánh',
        icon: 'chart-box-multiple',
        route: ROUTES.BRANCH_STATISTICS_HUB,
        description: 'Xem thống kê chi tiết chi nhánh',
      },
      {
        id: 'manager-10',
        name: 'Quản lý khách hàng',
        icon: 'account-multiple',
        route: ROUTES.CUSTOMER_LIST,
        description: 'Quản lý danh sách khách hàng',
      },
      {
        id: 'manager-11',
        name: 'Thông tin nhân viên',
        icon: 'account-group',
        route: ROUTES.BRANCH_EMPLOYEE_INFO_MENU,
        description: 'Xem thông tin nhân viên',
      },
    ],
    tabs: [
      {
        id: 'manager-tab-1',
        name: 'Home',
        label: 'Trang chủ',
      },
      // {
      //   id: 'manager-tab-2',
      //   name: 'MedicinesHub',
      //   label: 'Medicines',
      // },
    ],
  },
  employee: {
    options: [
      {
        id: 'staff-1',
        name: 'Lịch Làm Việc Của Tôi',
        icon: 'calendar-check',
        route: ROUTES.MY_WORK_SCHEDULE,
        description: 'Xem lịch làm việc cá nhân',
      },
      {
        id: 'staff-2',
        name: 'Lịch Sử Làm Việc',
        icon: 'history',
        route: ROUTES.EMPLOYEE_WORK_HISTORY,
        description: 'Xem lịch sử làm việc chi tiết',
      },
      {
        id: 'staff-3',
        name: 'Checkin / Checkout',
        icon: 'login',
        route: ROUTES.CHECKIN_CHECKOUT,
        description: 'Checkin và checkout',
      },
      {
        id: 'staff-4',
        name: 'Bán Hàng',
        icon: 'cash-register',
        route: ROUTES.SALES,
        description: 'Quản lý bán hàng',
      },
      {
        id: 'staff-5',
        name: 'Danh Sách Thuốc',
        icon: 'pill',
        route: ROUTES.EMPLOYEE_MEDICINES,
        description: 'Xem danh sách thuốc và tồn kho',
      },
      {
        id: 'staff-6',
        name: 'Lịch Sử Hóa Đơn',
        icon: 'file-document-outline',
        route: ROUTES.INVOICE_LIST,
        description: 'Xem danh sách hóa đơn đã tạo',
      },
      {
        id: 'staff-7',
        name: 'Lương Của Tôi',
        icon: 'cash-multiple',
        route: ROUTES.PAYROLL_MENU,
        description: 'Xem lương và chi tiết tính lương',
      },
      {
        id: 'staff-8',
        name: 'Thống Kê Doanh Thu',
        icon: 'chart-box',
        route: ROUTES.EMPLOYEE_STATISTICS,
        description: 'Xem thống kê doanh thu cá nhân',
      },
      {
        id: 'staff-9',
        name: 'Quản lý khách hàng',
        icon: 'account-multiple',
        route: ROUTES.CUSTOMER_LIST,
        description: 'Quản lý danh sách khách hàng',
      },
      {
        id: 'staff-10',
        name: 'Xem Tồn Kho Chi Nhánh',
        icon: 'package-box-multiple',
        route: ROUTES.BRANCH_INVENTORY_MANAGEMENT,
        description: 'Xem tồn kho của chi nhánh',
      },
    ],
    tabs: [
      {
        id: 'staff-tab-1',
        name: 'Home',
        label: 'Trang chủ',
      },
      // {
      //   id: 'staff-tab-2',
      //   name: 'MedicinesHub',
      //   label: 'Medicines',
      // },
    ],
  },
};

export const getRoleConfig = (role: UserRole | undefined): RoleConfig => {
  if (!role || !ROLE_CONFIG[role]) {
    return ROLE_CONFIG.employee; // Default là employee
  }
  return ROLE_CONFIG[role];
};

/**
 * Lấy config cho role cụ thể
 */
// export const getRoleConfig = (role: UserRole | undefined): RoleConfig => {
//   const normalized = normalizeRole(role);
//   if (!normalized || !ROLE_CONFIG[normalized as UserRole]) {
//     return ROLE_CONFIG.employee;
//   }
//   return ROLE_CONFIG[normalized as UserRole];
// };
