/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/screens/LoginScreen';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import WorkScheduleScreen from '@features/work-schdule/screens/WorkScheduleScreen';
import MyWorkScheduleScreen from '@features/work-schdule/screens/MyWorkScheduleScreen';
import CheckinCheckoutScreen from '@features/checkin-checkout/screens/CheckinCheckoutScreen';
import ImportListScreen from '@features/warehouse/screens/ImportListScreen';
import { ROUTES } from '@shared/constants/routes';
import { HomeNavigator, TabItem } from '@shared/components';
import HomeScreen from '@shared/screens/HomeScreen';
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from '@shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const tabs: TabItem[] = [
  { name: 'Home', component: HomeScreen, label: 'Trang chủ' },
  // { name: 'Orders', component: OrdersScreen, label: 'Đơn hàng' },
  // { name: 'Notifications', component: NotificationsScreen, label: 'Thông báo' },
  // { name: 'Profile', component: ProfileScreen, label: 'Tài khoản' },
];

// Create Auth Navigator
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
    <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
  </AuthStack.Navigator>
);

// Create Main Stack Navigator (contains tabs and other screens)
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainAppNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="HomeTabs">
      {() => (
        <HomeNavigator
          tabs={tabs}
          activeTintColor="#4CAF50"
          inactiveTintColor="#9E9E9E"
          tabBarStyle={{
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E0E0E0',
          }}
        />
      )}
    </MainStack.Screen>
    <MainStack.Screen
      name={ROUTES.WORK_SCHEDULE}
      component={WorkScheduleScreen}
    />
    <MainStack.Screen
      name={ROUTES.MY_WORK_SCHEDULE}
      component={MyWorkScheduleScreen}
    />
    <MainStack.Screen
      name={ROUTES.CHECKIN_CHECKOUT}
      component={CheckinCheckoutScreen}
    />
    <MainStack.Screen
      name={ROUTES.IMPORT_LIST}
      component={ImportListScreen}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
