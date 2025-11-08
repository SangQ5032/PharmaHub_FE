/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/screens/LoginScreen';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import { ROUTES } from '@shared/constants/routes';
import { HomeNavigator, TabItem } from '@shared/components';
import HomeScreen from '@shared/screens/HomeScreen';
import {
  RootStackParamList,
  AuthStackParamList,
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

// Create Main App Navigator with Tabs
const MainAppNavigator = () => (
  <HomeNavigator
    tabs={tabs}
    activeTintColor="#4CAF50"
    inactiveTintColor="#9E9E9E"
    tabBarStyle={{
      backgroundColor: '#FFFFFF',
      borderTopColor: '#E0E0E0',
    }}
  />
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
