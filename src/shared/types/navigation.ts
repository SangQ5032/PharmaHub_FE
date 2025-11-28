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
  [ROUTES.BRANCH_REVENUE_REPORT]: undefined;
  [ROUTES.BRANCH_EMPLOYEE_LIST]: {
    branchId: string;
    branchName: string;
  };
  [ROUTES.EMPLOYEE_WORK_HISTORY]: {
    employeeId?: string;
    employeeName?: string;
  };
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
  [ROUTES.REPORT_SELECTION]: undefined;
  [ROUTES.REPORT_VIEW]: {
    type: ReportType;
    format: ReportFormat;
    filter: ReportFilter;
    title: string;
  };
  [ROUTES.BRANCH_LIST]: undefined;
  [ROUTES.ADD_EDIT_BRANCH]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.BRANCH_DETAIL]: { branchId: string; branchName?: string } | undefined;
  [ROUTES.CATEGORIES]: undefined;
  [ROUTES.ADD_CATEGORY]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.CATEGORY_DETAIL]: { categoryId: string } | undefined;
};
