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
import WarehouseHubScreen from '@features/warehouse/screens/WarehouseHubScreen';
import {
  BranchRevenueReportScreen,
  // EmployeeWorkHistoryScreen, // ⚠️ DEPRECATED: Moved to work-schdule feature
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
  BranchEmployeeInfoMenuScreen,
  BranchEmployeeSelectionScreen,
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
  CategoriesScreen,
  AddCategoryScreen,
  CategoryDetailScreen,
} from '@features/categories';
import {
  CreateInvoiceScreen,
  SalesHubScreen,
  InvoiceListScreen,
  InvoiceDetailScreen,
  BranchInvoiceHistoryScreen,
  EmployeeInvoiceHistoryScreen,
  MedicineDetailScreen as SalesMedicineDetailScreen,
  CreateCustomerScreen,
  PaymentQRScreen,
  BarcodeScannerScreen,
  CustomerListScreen,
  CustomerDetailScreen,
} from '@features/sales';
import {
  WorkScheduleListScreen,
  CreateWeekScheduleScreen,
  WorkScheduleMenuScreen,
  MyWorkScheduleScreen,
  EmployeeWorkHistoryScreen,
  BranchWorkHistoryScreen,
  AdminWorkHistoryScreen,
  EmployeeWorkHistoryDetailScreen,
} from '@features/work-schdule';
import SystemAdminWorkScheduleMenuScreen from '@features/work-schdule/screens/SystemAdminWorkScheduleMenuScreen';
import WorkScheduleBranchSelectionScreen from '@features/work-schdule/screens/WorkScheduleBranchSelectionScreen';
import SystemAdminBranchWorkScheduleScreen from '@features/work-schdule/screens/SystemAdminBranchWorkScheduleScreen';
import { SystemAdminBranchWorkHistoryScreen } from '@features/work-schdule/screens/SystemAdminBranchWorkHistoryScreen';
import {
  PayrollMenuScreen,
  PayrollListScreen,
  BranchPayrollListScreen,
  PayrollBranchSelectionScreen,
  PayrollDetailsScreen,
  CreatePayrollScreen,
  PayrollSummaryScreen,
} from '@features/payroll';
import { StatisticsScreen } from '@features/statistics/screens';
import {
  BranchStatisticsHubScreen,
  RevenueStatsScreen,
  EmployeesStatsScreen,
  MedicinesStatsScreen,
  ImportsStatsScreen,
  BatchStatusStatsScreen,
  CustomersStatsScreen,
  RevenueByPeriodStatsScreen,
  SystemAdminStatisticsMenuScreen,
  SystemAdminBranchListScreen,
  SystemAdminBranchRevenueDetailedScreen,
  SystemAdminBranchRevenueDetailScreen,
  SystemAdminDashboardScreen,
  SystemAdminBranchRevenueScreen,
  SystemAdminEmployeeRevenueScreen,
  SystemAdminTopMedicinesScreen,
  SystemAdminBatchStatusScreen,
} from '@features/statistics/screens';
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
const MainStack = createNativeStackNavigator<any>();
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

      {/* Work Schedule History Routes */}
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_WORK_HISTORY}
        component={EmployeeWorkHistoryScreen}
        options={{ headerShown: true, title: 'Lịch Sử Làm Việc' }}
      />
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_WORK_HISTORY_DETAIL}
        component={EmployeeWorkHistoryDetailScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_WORK_HISTORY}
        component={BranchWorkHistoryScreen}
        options={{ headerShown: true, title: 'Lịch Sử Làm Việc' }}
      />
      <MainStack.Screen
        name={ROUTES.ADMIN_WORK_HISTORY}
        component={AdminWorkHistoryScreen}
        options={{ headerShown: true, title: 'Lịch Sử Làm Việc' }}
      />

      {/* System Admin Work Schedule Routes */}
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_MENU}
        component={SystemAdminWorkScheduleMenuScreen}
        options={{ headerShown: true, title: 'Quản lý Lịch Làm Việc' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_BRANCH_SELECTION}
        component={WorkScheduleBranchSelectionScreen}
        options={{ headerShown: true, title: 'Chọn Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_WORK_HISTORY_BRANCH_SELECTION}
        component={WorkScheduleBranchSelectionScreen}
        options={{ headerShown: true, title: 'Chọn Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_BRANCH_WORK_SCHEDULE}
        component={SystemAdminBranchWorkScheduleScreen}
        options={{ headerShown: true, title: 'Lịch Làm Việc' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_BRANCH_WORK_HISTORY}
        component={SystemAdminBranchWorkHistoryScreen}
        options={{ headerShown: true, title: 'Lịch Sử Làm Việc' }}
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
      {/* ⚠️ DEPRECATED: Use ROUTES.EMPLOYEE_WORK_HISTORY from work-schdule instead
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_WORK_HISTORY}
        component={EmployeeWorkHistoryScreen}
      />
      */}
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
      <MainStack.Screen
        name={ROUTES.BRANCH_EMPLOYEE_INFO_MENU}
        component={BranchEmployeeInfoMenuScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_EMPLOYEE_SELECTION}
        component={BranchEmployeeSelectionScreen}
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
      <MainStack.Screen
        name={ROUTES.WAREHOUSE_HUB}
        component={WarehouseHubScreen}
        options={{ headerShown: true, title: 'Quản Lý Tồn Kho' }}
      />

      {/* Categories Routes */}
      <MainStack.Screen
        name={ROUTES.CATEGORIES}
        component={CategoriesScreen}
        options={{ headerShown: true, title: 'Danh mục' }}
      />
      <MainStack.Screen
        name={ROUTES.ADD_CATEGORY}
        component={AddCategoryScreen}
        options={{ headerShown: true, title: 'Thêm / Sửa danh mục' }}
      />
      <MainStack.Screen
        name={ROUTES.CATEGORY_DETAIL}
        component={CategoryDetailScreen}
        options={{ headerShown: true, title: 'Chi tiết danh mục' }}
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
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_INVOICE_HISTORY}
        component={EmployeeInvoiceHistoryScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="BarcodeScanner"
        component={BarcodeScannerScreen}
        options={{ headerShown: true, title: 'Scan Barcode' }}
      />
      <MainStack.Screen
        name={ROUTES.CUSTOMER_LIST}
        component={CustomerListScreen}
        options={{ headerShown: true, title: 'Danh sách khách hàng' }}
      />
      <MainStack.Screen
        name={ROUTES.CUSTOMER_DETAIL}
        component={CustomerDetailScreen}
        options={{ headerShown: true, title: 'Chi tiết khách hàng' }}
      />

      {/* Payroll Routes */}
      <MainStack.Screen
        name={ROUTES.PAYROLL_MENU}
        component={PayrollMenuScreen}
        options={{ headerShown: true, title: 'Quản Lý Lương' }}
      />
      <MainStack.Screen
        name={ROUTES.PAYROLL_LIST}
        component={BranchPayrollListScreen}
        options={{ headerShown: true, title: 'Danh Sách Bảng Lương' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_PAYROLL_LIST}
        component={BranchPayrollListScreen}
        options={{ headerShown: true, title: 'Bảng Lương Theo Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.PAYROLL_BRANCH_SELECTION}
        component={PayrollBranchSelectionScreen}
        options={{ headerShown: true, title: 'Chọn Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.PAYROLL_DETAIL}
        component={PayrollDetailsScreen}
        options={{ headerShown: true, title: 'Chi Tiết Lương' }}
      />
      <MainStack.Screen
        name={ROUTES.CREATE_PAYROLL}
        component={CreatePayrollScreen}
        options={{ headerShown: true, title: 'Tạo Bảng Lương' }}
      />
      <MainStack.Screen
        name={ROUTES.PAYROLL_SUMMARY}
        component={PayrollSummaryScreen}
        options={{ headerShown: true, title: 'Báo Cáo Lương' }}
      />

      {/* Statistics Routes */}
      <MainStack.Screen
        name={ROUTES.EMPLOYEE_STATISTICS}
        component={StatisticsScreen}
        options={{ headerShown: true, title: 'Thống Kê Doanh Thu' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_STATISTICS_HUB}
        component={BranchStatisticsHubScreen}
        options={{ headerShown: true, title: 'Thống Kê Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_REVENUE_STATS}
        component={RevenueStatsScreen}
        options={{ headerShown: true, title: 'Doanh Thu Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_EMPLOYEES_STATS}
        component={EmployeesStatsScreen}
        options={{ headerShown: true, title: 'Doanh Thu Nhân Viên' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_MEDICINES_STATS}
        component={MedicinesStatsScreen}
        options={{ headerShown: true, title: 'Bán Hàng Theo Thuốc' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_IMPORTS_STATS}
        component={ImportsStatsScreen}
        options={{ headerShown: true, title: 'Lô Hàng Đã Nhập' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_BATCH_STATUS_STATS}
        component={BatchStatusStatsScreen}
        options={{ headerShown: true, title: 'Tình Trạng Lô Hàng' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_CUSTOMERS_STATS}
        component={CustomersStatsScreen}
        options={{ headerShown: true, title: 'Doanh Thu Khách Hàng' }}
      />
      <MainStack.Screen
        name={ROUTES.BRANCH_REVENUE_BY_PERIOD_STATS}
        component={RevenueByPeriodStatsScreen}
        options={{ headerShown: true, title: 'Xu Hướng Doanh Thu' }}
      />

      {/* System Admin Statistics Routes */}
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_STATISTICS_MENU}
        component={SystemAdminStatisticsMenuScreen}
        options={{ headerShown: true, title: 'Thống Kê Hệ Thống' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_BRANCH_LIST}
        component={SystemAdminBranchListScreen}
        options={{ headerShown: true, title: 'Chi Nhánh' }}
      />
      <MainStack.Screen
        name={ROUTES.SYSTEM_ADMIN_BRANCH_REVENUE_DETAILED}
        component={SystemAdminBranchRevenueDetailedScreen}
        options={{ headerShown: true, title: 'Doanh Thu Chi Nhánh' }}
      />
      <MainStack.Screen
        name="SystemAdminBranchRevenueDetail"
        component={SystemAdminBranchRevenueDetailScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SystemAdminDashboard"
        component={SystemAdminDashboardScreen}
        options={{ headerShown: true, title: 'Dashboard Quản Lý Hệ Thống' }}
      />
      <MainStack.Screen
        name="SystemAdminBranchRevenue"
        component={SystemAdminBranchRevenueScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SystemAdminEmployeeRevenue"
        component={SystemAdminEmployeeRevenueScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SystemAdminTopMedicines"
        component={SystemAdminTopMedicinesScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SystemAdminBatchStatus"
        component={SystemAdminBatchStatusScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="SystemAdminRevenueByPeriod"
        component={RevenueByPeriodStatsScreen}
        options={{
          headerShown: true,
          title: 'Xu Hướng Doanh Thu Toàn Hệ Thống',
        }}
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
