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
  system_admin: {
    options: [
      {
        id: 'admin-1',
        name: 'Quản lý nhân viên',
        icon: 'account-group',
        route: ROUTES.EMPLOYEE_MANAGEMENT,
        description: 'Quản lý toàn bộ nhân viên',
      },
      {
        id: 'admin-2',
        name: 'Báo cáo doanh thu',
        icon: 'chart-line',
        route: ROUTES.BRANCH_REVENUE_REPORT,
        description: 'Xem báo cáo doanh thu chi tiết',
      },
      {
        id: 'admin-3',
        name: 'Quản lý thuốc',
        icon: 'pill',
        route: ROUTES.MEDICINE_MANAGEMENT,
        description: 'Quản lý kho thuốc',
      },
      {
        id: 'admin-4',
        name: 'Quản lý chi nhánh',
        icon: 'office-building',
        route: ROUTES.BRANCH_LIST,
        description: 'Quản lý thông tin chi nhánh',
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
      {
        id: 'admin-tab-3',
        name: 'ReportsHub',
        label: 'Reports',
      },
    ],
  },
  branch_manager: {
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
        route: ROUTES.EMPLOYEE_WORK_HISTORY,
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
        name: 'Nhập Hàng',
        icon: 'truck-delivery',
        route: ROUTES.IMPORT_LIST,
        description: 'Quản lý đơn nhập hàng',
      },
      {
        id: 'manager-5',
        name: 'Lịch sử hoá đơn',
        icon: 'file-document-outline',
        route: ROUTES.BRANCH_INVOICE_HISTORY,
        description: 'Xem lịch sử bán hàng',
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
        name: 'Checkin / Checkout',
        icon: 'login',
        route: ROUTES.CHECKIN_CHECKOUT,
        description: 'Checkin và checkout',
      },
      {
        id: 'staff-3',
        name: 'Bán Hàng',
        icon: 'cash-register',
        route: ROUTES.SALES,
        description: 'Quản lý bán hàng',
      },
      {
        id: 'staff-4',
        name: 'Danh Sách Thuốc',
        icon: 'pill',
        route: ROUTES.EMPLOYEE_MEDICINES,
        description: 'Xem danh sách thuốc và tồn kho',
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
const normalizeRole = (role?: string) => role?.replace(/-/g, '_').toLowerCase();
export const getRoleConfig = (role: UserRole | undefined): RoleConfig => {
  const normalized = normalizeRole(role);
  if (!normalized || !ROLE_CONFIG[normalized as UserRole]) {
    return ROLE_CONFIG.employee;
  }
  return ROLE_CONFIG[normalized as UserRole];
};

/**
 * Lấy config cho role cụ thể
 */
// export const getRoleConfig = (role: UserRole | undefined): RoleConfig => {
//   if (!role || !ROLE_CONFIG[role]) {
//     return ROLE_CONFIG.employee; // Default là staff
//   }
//   return ROLE_CONFIG[role];
// };
