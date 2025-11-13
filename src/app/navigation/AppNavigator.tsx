/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@features/auth/screens/LoginScreen';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import WorkScheduleScreen from '@features/work-schdule/screens/WorkScheduleScreen';
import MyWorkScheduleScreen from '@features/work-schdule/screens/MyWorkScheduleScreen';
import CheckinCheckoutScreen from '@features/checkin-checkout/screens/CheckinCheckoutScreen';
import { ROUTES } from '@shared/constants/routes';
import { HomeNavigator, TabItem } from '@shared/components';
import HomeScreen from '@shared/screens/HomeScreen';
import {
  MedicinesHubScreen,
  MedicineListScreen,
  AddMedicineScreen,
} from '@features/medicines'; // <-- ensure AddMedicineScreen import if present
import MedicineDetailScreen from '@features/medicines/screens/MedicineDetailScreen';
import { SuppliersScreen, AddSupplierScreen } from '@features/suppliers';
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from '@shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const tabs: TabItem[] = [
  { name: 'Home', component: HomeScreen, label: 'Trang chủ' },
  {
    name: ROUTES.MEDICINES_HUB,
    component: MedicinesHubScreen,
    label: 'Medicines Hub',
  },
];

// Create Auth Navigator
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    {/* Tạm bỏ qua màn login và phonelogin (comment, không xóa) */}
    {/*
    <AuthStack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
    <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    */}
    <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
  </AuthStack.Navigator>
);

// Create Main Stack Navigator (contains tabs and other screens)
const MainStack = createNativeStackNavigator<MainStackParamList>();

// Wrapper component so Screen receives a component prop (no non-Screen child in Navigator)
const HomeTabsWrapper = () => (
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

const MainAppNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    {/* Use component prop with wrapper instead of child render function */}
    <MainStack.Screen name="HomeTabs" component={HomeTabsWrapper} />
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
      name={ROUTES.MEDICINES_HUB}
      component={MedicinesHubScreen}
    />
    <MainStack.Screen name={ROUTES.MEDICINES} component={MedicineListScreen} />
    <MainStack.Screen
      name={ROUTES.MEDICINE_DETAIL}
      component={MedicineDetailScreen}
    />
    <MainStack.Screen name={ROUTES.SUPPLIERS} component={SuppliersScreen} />
    <MainStack.Screen
      name={ROUTES.ADD_SUPPLIER}
      component={AddSupplierScreen}
    />
    {/* If AddMedicineScreen exists */}
    <MainStack.Screen
      name={ROUTES.ADD_MEDICINE}
      component={AddMedicineScreen}
    />
  </MainStack.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Khi mở app, vào luôn MainApp. Tạm comment màn Auth và set initialRouteName */}
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="MainApp"
      >
        {/*
        <Stack.Screen name="Auth" component={AuthNavigator} />
        */}
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
