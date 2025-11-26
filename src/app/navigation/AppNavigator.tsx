import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneLoginScreen from '@features/auth/screens/PhoneLoginScreen';
import CheckinCheckoutScreen from '@features/checkin-checkout/screens/CheckinCheckoutScreen';
import ImportListScreen from '@features/warehouse/screens/ImportListScreen';
import CreateImportScreen from '@features/warehouse/screens/CreateImportScreen';
import ImportDetailScreen from '@features/warehouse/screens/ImportDetailScreen';
import InventoryListScreen from '@features/warehouse/screens/InventoryListScreen';
import InventoryDetailScreen from '@features/warehouse/screens/InventoryDetailScreen';
import InventoryDetailWithBatchesScreen from '@features/warehouse/screens/InventoryDetailWithBatchesScreen';
import InventoryDetailExpandedScreen from '@features/warehouse/screens/InventoryDetailExpandedScreen';
import BatchDetailExpandedScreen from '@features/warehouse/screens/BatchDetailExpandedScreen';
import BatchDetailScreen from '@features/warehouse/screens/BatchDetailScreen';
import BranchInventoryManagementScreen from '@features/warehouse/screens/BranchInventoryManagementScreen';
import ReportSelectionScreen from '@features/warehouse/screens/ReportSelectionScreen';
import ReportViewScreen from '@features/warehouse/screens/ReportViewScreen';
import {
  BranchRevenueReportScreen,
  EmployeeWorkHistoryScreen,
  EmployeeRevenueScreen,
  MedicineManagementScreen,
} from '@features/revenue-report';
import {
  EmployeeManagementScreen,
  BranchEmployeeListScreen,
  CreateEmployeeScreen,
} from '@features/employee-management/screens';
import {
  BranchListScreen,
  BranchFormScreen,
  MapPickerScreen,
} from '@features/branches';
import BranchDetailScreen from '@features/branches/screens/BranchDetailScreen';
import { ROUTES } from '@shared/constants/routes';
import { HomeNavigator, TabItem } from '@shared/components';
import HomeScreen from '@shared/screens/HomeScreen';
import ReportsHubScreen from '@shared/screens/ReportsHubScreen';
import {
  MedicinesHubScreen,
  MedicineListScreen,
  AddMedicineScreen,
  EmployeeMedicineListScreen,
} from '@features/medicines';
import MedicineDetailScreen from '@features/medicines/screens/MedicineDetailScreen';
import { SuppliersScreen, AddSupplierScreen } from '@features/suppliers';
import {
  CreateInvoiceScreen,
  SalesHubScreen,
  InvoiceListScreen,
  InvoiceDetailScreen,
  BranchInvoiceHistoryScreen,
  MedicineDetailScreen as SalesMedicineDetailScreen,
  CreateCustomerScreen,
  PaymentQRScreen,
} from '@features/sales';
import {
  WorkScheduleListScreen,
  CreateWeekScheduleScreen,
  WorkScheduleMenuScreen,
  MyWorkScheduleScreen,
} from '@features/work-schdule';
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
        name={ROUTES.WORK_SCHEDULE_MENU}
        component={WorkScheduleMenuScreen}
        options={{ headerShown: true, title: 'Lịch Làm Việc' }}
      />
      <MainStack.Screen
        name={ROUTES.WORK_SCHEDULE_LIST}
        component={WorkScheduleListScreen}
        options={{ headerShown: true, title: 'Lịch làm việc' }}
      />
      <MainStack.Screen
        name={ROUTES.MY_WORK_SCHEDULE}
        component={MyWorkScheduleScreen}
        options={{ headerShown: true, title: 'Lịch của tôi' }}
      />
      <MainStack.Screen
        name={ROUTES.CREATE_WEEK_SCHEDULE}
        component={CreateWeekScheduleScreen}
        options={{ headerShown: true, title: 'Tạo lịch tuần' }}
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
        name={ROUTES.EMPLOYEE_MEDICINES}
        component={EmployeeMedicineListScreen}
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
        options={{ headerShown: true, title: 'Quản lý nhân viên' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_EMPLOYEE_LIST}
        component={BranchEmployeeListScreen}
        options={{ headerShown: true, title: 'Danh sách nhân viên' }}
      />
      <MainStack.Screen
        name="CREATE_EMPLOYEE"
        component={CreateEmployeeScreen}
        options={{ headerShown: false }}
      />

      {/* Branch Management Routes */}
      <MainStack.Screen
        name={ROUTES.BRANCH_LIST}
        component={BranchListScreen}
        options={{ headerShown: true, title: 'Chi nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.ADD_EDIT_BRANCH}
        component={BranchFormScreen}
        options={{ headerShown: true, title: 'Thêm / Sửa chi nhánh' }}
      />
      <MainStack.Screen
        name="MapPicker"
        component={MapPickerScreen}
        options={{ headerShown: true, title: 'Chọn vị trí' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_DETAIL}
        component={BranchDetailScreen}
        options={{ headerShown: false }}
      />

      {/* Warehouse Routes */}
      <MainStack.Screen
        name={ROUTES.IMPORT_LIST}
        component={ImportListScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.CREATE_IMPORT}
        component={CreateImportScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.IMPORT_DETAIL}
        component={ImportDetailScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.INVENTORY_LIST}
        component={InventoryListScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.INVENTORY_DETAIL}
        component={InventoryDetailScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.INVENTORY_DETAIL_WITH_BATCHES}
        component={InventoryDetailExpandedScreen}
        options={{ headerShown: true, title: 'Chi tiết thuốc' }}
      />
      <MainStack.Screen
        name={ROUTES.BATCH_DETAIL}
        component={BatchDetailExpandedScreen}
        options={{ headerShown: true, title: 'Chi tiết lô hàng' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_INVENTORY_MANAGEMENT}
        component={BranchInventoryManagementScreen}
        options={{ headerShown: true, title: 'Quản lý tồn kho' }}
      />
      <MainStack.Screen
        name={ROUTES.REPORT_SELECTION}
        component={ReportSelectionScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.REPORT_VIEW}
        component={ReportViewScreen}
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
        name="SalesMedicineDetail"
        component={SalesMedicineDetailScreen}
        options={{ headerShown: true, title: 'Chi tiết thuốc' }}
      />
      <MainStack.Screen
        name="CreateCustomer"
        component={CreateCustomerScreen}
        options={{ headerShown: true, title: 'Tạo khách hàng' }}
      />
      <MainStack.Screen
        name="PaymentQR"
        component={PaymentQRScreen}
        options={{ headerShown: true, title: 'Thanh toán QR' }}
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
      <MainStack.Screen
        name={ROUTES.BRANCH_INVOICE_HISTORY}
        component={BranchInvoiceHistoryScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Auth"
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="MainApp" component={MainAppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
