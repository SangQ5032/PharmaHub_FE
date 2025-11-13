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
};
