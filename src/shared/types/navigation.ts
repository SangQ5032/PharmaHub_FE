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
};
