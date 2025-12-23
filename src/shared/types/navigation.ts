import { ROUTES } from '@shared/constants/routes';
import {
  ReportType,
  ReportFormat,
  ReportFilter,
} from '@features/warehouse/types/report.types';

export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

export type AuthStackParamList = {
  [ROUTES.PHONE_LOGIN]: undefined;
  [ROUTES.LOGIN]: undefined;
};

export type MainStackParamList = {
  HomeTabs: undefined;
  [ROUTES.WORK_SCHEDULE]: undefined;
  [ROUTES.MY_WORK_SCHEDULE]: undefined;
  [ROUTES.WORK_SCHEDULE_MENU]: undefined;
  [ROUTES.WORK_SCHEDULE_LIST]: undefined;
  [ROUTES.CREATE_WEEK_SCHEDULE]: undefined;
  [ROUTES.CHECKIN_CHECKOUT]: undefined;
  [ROUTES.MEDICINES_HUB]: undefined;
  [ROUTES.MEDICINES]: undefined;
  [ROUTES.EMPLOYEE_MEDICINES]: undefined;
  [ROUTES.MEDICINE_DETAIL]: { item: any } | undefined;
  [ROUTES.ADD_MEDICINE]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.SUPPLIERS]: undefined;
  [ROUTES.ADD_SUPPLIER]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.IMPORT_LIST]: undefined;
  [ROUTES.CREATE_IMPORT]: undefined;
  [ROUTES.IMPORT_DETAIL]: undefined;
  [ROUTES.INVENTORY_LIST]: undefined;
  [ROUTES.INVENTORY_DETAIL]: undefined;
  [ROUTES.INVENTORY_DETAIL_WITH_BATCHES]: undefined;
  [ROUTES.BATCH_DETAIL]: { id?: string; batch?: any } | undefined;
  [ROUTES.BRANCH_INVENTORY_MANAGEMENT]:
    | { initialTab?: 'inventory' | 'batches' | 'imports' }
    | undefined;
  [ROUTES.REPORT_SELECTION]: undefined;
  [ROUTES.REPORT_VIEW]: {
    type: ReportType;
    format: ReportFormat;
    filter: ReportFilter;
    title: string;
  };
  [ROUTES.WAREHOUSE_HUB]: undefined;
  [ROUTES.BRANCH_REVENUE_REPORT]: undefined;
  [ROUTES.BRANCH_EMPLOYEE_LIST]: {
    branchId: string;
    branchName: string;
  };
  [ROUTES.BRANCH_EMPLOYEE_INFO_MENU]: {
    branchId: string;
    branchName?: string;
  };
  [ROUTES.BRANCH_EMPLOYEE_SELECTION]: {
    branchId: string;
    branchName?: string;
    mode: 'work-history' | 'invoice-history';
  };
  [ROUTES.EMPLOYEE_WORK_HISTORY]: {
    employeeId?: string;
    employeeName?: string;
    branchId?: string;
    branchName?: string;
  };
  [ROUTES.EMPLOYEE_WORK_HISTORY_DETAIL]: undefined;
  [ROUTES.BRANCH_WORK_HISTORY]: undefined;
  [ROUTES.ADMIN_WORK_HISTORY]: undefined;
  [ROUTES.EMPLOYEE_REVENUE]: {
    employeeId?: string;
    employeeName?: string;
  };
  [ROUTES.MEDICINE_MANAGEMENT]: undefined;
  [ROUTES.EMPLOYEE_MANAGEMENT]: undefined;
  [ROUTES.ADD_EDIT_EMPLOYEE]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.SALES]: undefined;
  [ROUTES.CREATE_INVOICE]: undefined;
  [ROUTES.INVOICE_LIST]: undefined;
  [ROUTES.INVOICE_DETAIL]: { invoiceId: string } | undefined;
  [ROUTES.BRANCH_INVOICE_HISTORY]: undefined;
  [ROUTES.EMPLOYEE_INVOICE_HISTORY]: {
    employeeId: string;
    employeeName?: string;
    branchId?: string;
    branchName?: string;
  };
  [ROUTES.MEDICINE_SELECTION]: {
    onAddMedicine?: (
      selectedMedicine: any,
      quantity: number,
      unit: string,
      price?: number,
      batchId?: string,
      batchNumber?: string,
    ) => void;
  };
  [ROUTES.BRANCH_LIST]: undefined;
  [ROUTES.ADD_EDIT_BRANCH]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.BRANCH_DETAIL]: { branchId: string; branchName?: string } | undefined;
  [ROUTES.CATEGORIES]: undefined;
  [ROUTES.ADD_CATEGORY]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.CATEGORY_DETAIL]: { categoryId: string } | undefined;
  [ROUTES.PAYROLL_MENU]: undefined;
  [ROUTES.PAYROLL_LIST]: undefined;
  [ROUTES.BRANCH_PAYROLL_LIST]: undefined;
  [ROUTES.PAYROLL_BRANCH_SELECTION]: undefined;
  [ROUTES.PAYROLL_DETAIL]: { payrollId: string } | undefined;
  [ROUTES.CREATE_PAYROLL]: undefined;
  [ROUTES.PAYROLL_SUMMARY]: { branchId?: string; month?: string } | undefined;
  [ROUTES.EMPLOYEE_STATISTICS]: undefined;
  // System Admin Work Schedule routes
  [ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_MENU]: undefined;
  [ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_BRANCH_SELECTION]: undefined;
  [ROUTES.SYSTEM_ADMIN_WORK_HISTORY_BRANCH_SELECTION]: undefined;
  [ROUTES.SYSTEM_ADMIN_BRANCH_WORK_SCHEDULE]: {
    branchId: string;
    branchName: string;
  };
  [ROUTES.SYSTEM_ADMIN_BRANCH_WORK_HISTORY]: {
    branchId: string;
    branchName: string;
  };
  // Additional non-ROUTES screen names
  CREATE_EMPLOYEE: undefined;
  MapPicker: undefined;
  SalesMedicineDetail: undefined;
  CreateCustomer: undefined;
  PaymentQR: undefined;
};
