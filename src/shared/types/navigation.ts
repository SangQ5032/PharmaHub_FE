import { ROUTES } from '@shared/constants/routes';

export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

export type AuthStackParamList = {
  [ROUTES.PHONE_LOGIN]: undefined;
  [ROUTES.LOGIN]: undefined;
};
