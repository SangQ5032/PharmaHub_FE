import { ROUTES } from '@shared/constants/routes';

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
  [ROUTES.MEDICINE_DETAIL]: { item: any } | undefined;
  [ROUTES.ADD_MEDICINE]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.SUPPLIERS]: undefined;
  [ROUTES.ADD_SUPPLIER]: { mode?: 'edit'; item?: any } | undefined;
  [ROUTES.IMPORT_LIST]: undefined;
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
};
