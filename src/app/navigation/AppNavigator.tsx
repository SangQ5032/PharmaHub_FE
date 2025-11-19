/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import WorkScheduleScreen from '@features/work-schdule/screens/WorkScheduleScreen';
import MyWorkScheduleScreen from '@features/work-schdule/screens/MyWorkScheduleScreen';
import CheckinCheckoutScreen from '@features/checkin-checkout/screens/CheckinCheckoutScreen';
import ImportListScreen from '@features/warehouse/screens/ImportListScreen';
import InventoryListScreen from '@features/warehouse/screens/InventoryListScreen';
import {
  BranchRevenueReportScreen,
  BranchEmployeeListScreen,
  EmployeeWorkHistoryScreen,
  EmployeeRevenueScreen,
  MedicineManagementScreen,
  EmployeeManagementScreen,
  AddEditEmployeeScreen,
} from '@features/revenue-report';
import CreateImportScreen from '@features/warehouse/screens/CreateImportScreen';
import { ROUTES } from '@shared/constants/routes';
import { HomeNavigator, TabItem } from '@shared/components';
import HomeScreen from '@shared/screens/HomeScreen';
import ReportsHubScreen from '@shared/screens/ReportsHubScreen';
import {
  MedicinesHubScreen,
  MedicineListScreen,
  AddMedicineScreen,
} from '@features/medicines';
import MedicineDetailScreen from '@features/medicines/screens/MedicineDetailScreen';
import { SuppliersScreen, AddSupplierScreen } from '@features/suppliers';
import {
  CreateInvoiceScreen,
  SalesHubScreen,
  InvoiceListScreen,
  InvoiceDetailScreen,
} from '@features/sales';
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
} from '@shared/types/navigation';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { getRoleConfig } from '@shared/config/roleConfig';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Map tab names to components
const TAB_COMPONENTS: Record<string, React.ComponentType<any>> = {
  Home: HomeScreen,
  MedicinesHub: MedicinesHubScreen,
  ReportsHub: ReportsHubScreen,
};

// Create Auth Navigator - chỉ có PhoneLoginScreen
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name={ROUTES.PHONE_LOGIN} component={PhoneLoginScreen} />
  </AuthStack.Navigator>
);

// Create Main Stack Navigator (contains tabs and other screens)
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainAppNavigator = () => {
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  // Lấy config tabs dựa trên role
  const roleConfig = React.useMemo(() => {
    return getRoleConfig(role);
  }, [role]);

  // Chuyển đổi tab config thành TabItem
  const tabs: TabItem[] = React.useMemo(() => {
    return roleConfig.tabs
      .map(tabConfig => {
        const component = TAB_COMPONENTS[tabConfig.name];
        if (!component) return null;
        return {
          name: tabConfig.name as keyof any,
          component,
          label: tabConfig.label,
        };
      })
      .filter((tab): tab is TabItem => tab !== null);
  }, [roleConfig.tabs]);

  return (
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

      {/* Work Schedule Routes */}
      <MainStack.Screen
        name={ROUTES.WORK_SCHEDULE}
        component={WorkScheduleScreen}
      />
      <MainStack.Screen
        name={ROUTES.MY_WORK_SCHEDULE}
        component={MyWorkScheduleScreen}
      />

      {/* Checkin/Checkout */}
      <MainStack.Screen
        name={ROUTES.CHECKIN_CHECKOUT}
        component={CheckinCheckoutScreen}
      />

      {/* Medicine Routes */}
      <MainStack.Screen
        name={ROUTES.MEDICINES}
        component={MedicineListScreen}
      />
      <MainStack.Screen
        name={ROUTES.ADD_MEDICINE}
        component={AddMedicineScreen}
      />
      <MainStack.Screen
        name={ROUTES.MEDICINE_DETAIL}
        component={MedicineDetailScreen}
      />
      <MainStack.Screen
        name={ROUTES.MEDICINE_MANAGEMENT}
        component={MedicineManagementScreen}
      />

      {/* Revenue Report Routes */}
      <MainStack.Screen
        name={ROUTES.BRANCH_REVENUE_REPORT}
        component={BranchRevenueReportScreen}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_EMPLOYEE_LIST}
        component={BranchEmployeeListScreen}
      />
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_WORK_HISTORY}
        component={EmployeeWorkHistoryScreen}
      />
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_REVENUE}
        component={EmployeeRevenueScreen}
      />

      {/* Employee Management Routes */}
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_MANAGEMENT}
        component={EmployeeManagementScreen}
      />
      <MainStack.Screen
        name={ROUTES.ADD_EDIT_EMPLOYEE}
        component={AddEditEmployeeScreen}
      />

      {/* Warehouse Routes */}
      <MainStack.Screen
        name={ROUTES.IMPORT_LIST}
        component={ImportListScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.INVENTORY_LIST}
        component={InventoryListScreen}
        options={{ headerShown: false }}
      />

      {/* Suppliers Routes */}
      <MainStack.Screen name={ROUTES.SUPPLIERS} component={SuppliersScreen} />
      <MainStack.Screen
        name={ROUTES.ADD_SUPPLIER}
        component={AddSupplierScreen}
      />

      {/* Sales Routes */}
      <MainStack.Screen
        name={ROUTES.SALES}
        component={SalesHubScreen}
        options={{ headerShown: true, title: 'Bán hàng' }}
      />
      <MainStack.Screen
        name={ROUTES.CREATE_INVOICE}
        component={CreateInvoiceScreen}
        options={{ headerShown: true, title: 'Tạo Hóa Đơn' }}
      />
      <MainStack.Screen
        name={ROUTES.INVOICE_LIST}
        component={InvoiceListScreen}
        options={{ headerShown: true, title: 'Danh sách hóa đơn' }}
      />
      <MainStack.Screen
        name={ROUTES.INVOICE_DETAIL}
        component={InvoiceDetailScreen}
        options={{ headerShown: true, title: 'Chi tiết hóa đơn' }}
      />
    </MainStack.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      {/* Khi mở app, vào luôn MainApp. Tạm comment màn Auth và set initialRouteName */}
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Auth"
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
        {/* <Stack.Screen
          name={ROUTES.CREATE_IMPORT}
          component={CreateImportScreen}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
