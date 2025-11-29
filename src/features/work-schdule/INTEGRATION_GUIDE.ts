/**
 * Hướng dẫn tích hợp Work Schedule History vào AppNavigator
 *
 * Cập nhật file: src/app/navigation/AppNavigator.tsx
 *
 * 1. Import các components mới:
 *
 * import {
 *   EmployeeWorkHistoryScreen,
 *   BranchWorkHistoryScreen,
 *   AdminWorkHistoryScreen,
 * } from '@features/work-schdule';
 *
 * 2. Thêm các screen vào navigation tương ứng với role:
 *
 * // Trong MainStack (hoặc EmployeeStack nếu đã chia)
 * <Stack.Screen
 *   name={ROUTES.EMPLOYEE_WORK_HISTORY}
 *   component={EmployeeWorkHistoryScreen}
 *   options={{
 *     title: 'Lịch sử làm việc của tôi',
 *     headerShown: true,
 *   }}
 * />
 *
 * // Trong BranchManagerStack
 * <Stack.Screen
 *   name={ROUTES.BRANCH_WORK_HISTORY}
 *   component={BranchWorkHistoryScreen}
 *   options={{
 *     title: 'Lịch sử làm việc chi nhánh',
 *     headerShown: true,
 *   }}
 * />
 *
 * // Trong AdminStack
 * <Stack.Screen
 *   name={ROUTES.ADMIN_WORK_HISTORY}
 *   component={AdminWorkHistoryScreen}
 *   options={{
 *     title: 'Lịch sử làm việc toàn hệ thống',
 *     headerShown: true,
 *   }}
 * />
 *
 * 3. Cấu trúc Navigator nên như sau:
 *
 * AppNavigator
 * ├── EmployeeStack
 * │   ├── EmployeeWorkHistoryScreen (EMPLOYEE_WORK_HISTORY)
 * │   ├── MyWorkScheduleScreen (MY_WORK_SCHEDULE)
 * │   ├── CheckinCheckoutScreen (CHECKIN_CHECKOUT)
 * │   └── ...
 * ├── BranchManagerStack
 * │   ├── BranchWorkHistoryScreen (BRANCH_WORK_HISTORY)
 * │   ├── WorkScheduleMenuScreen (WORK_SCHEDULE_MENU)
 * │   └── ...
 * └── AdminStack
 *     ├── AdminWorkHistoryScreen (ADMIN_WORK_HISTORY)
 *     ├── EmployeeManagementScreen (EMPLOYEE_MANAGEMENT)
 *     └── ...
 *
 * 4. Cập nhật roleConfig.ts để điều hướng đến đúng screen:
 *
 * // file: src/shared/config/roleConfig.ts
 *
 * branch_manager: {
 *   options: [
 *     {
 *       id: 'manager-2',
 *       name: 'Lịch sử làm việc',
 *       icon: 'history',
 *       route: ROUTES.BRANCH_WORK_HISTORY,  // Cập nhật từ EMPLOYEE_WORK_HISTORY
 *       description: 'Xem lịch sử làm việc',
 *     },
 *     // ...
 *   ],
 *   // ...
 * },
 *
 * system_admin: {
 *   options: [
 *     {
 *       id: 'admin-1',
 *       name: 'Quản lý nhân viên',
 *       icon: 'account-group',
 *       route: ROUTES.EMPLOYEE_MANAGEMENT,
 *       description: 'Quản lý toàn bộ nhân viên',
 *     },
 *     // Có thể thêm option để xem lịch sử làm việc
 *     {
 *       id: 'admin-work-history',
 *       name: 'Lịch sử làm việc',
 *       icon: 'history',
 *       route: ROUTES.ADMIN_WORK_HISTORY,
 *       description: 'Xem lịch sử làm việc toàn hệ thống',
 *     },
 *     // ...
 *   ],
 *   // ...
 * },
 */

export const WORK_HISTORY_INTEGRATION_GUIDE = `
Hướng dẫn tích hợp Work Schedule History

## Routes cần thêm vào AppNavigator

1. EMPLOYEE_WORK_HISTORY -> EmployeeWorkHistoryScreen
   - Dùng cho: employee
   - Hiển thị: Lịch sử làm việc của chính mình
   
2. BRANCH_WORK_HISTORY -> BranchWorkHistoryScreen  
   - Dùng cho: branch_manager
   - Hiển thị: Lịch sử làm việc nhân viên trong chi nhánh
   
3. ADMIN_WORK_HISTORY -> AdminWorkHistoryScreen
   - Dùng cho: system_admin
   - Hiển thị: Lịch sử làm việc toàn bộ hệ thống

## Cập nhật roleConfig.ts

Branch Manager cần đổi:
EMPLOYEE_WORK_HISTORY -> BRANCH_WORK_HISTORY

System Admin có thể thêm:
- Route ADMIN_WORK_HISTORY để xem lịch sử làm việc

## Features đã implement

✅ API services (getMyWorkHistory, getBranchEmployeesWorkHistory, getAllWorkHistory)
✅ Types và interfaces đầy đủ
✅ Custom hooks với React Query
✅ Components UI (WorkHistoryList, WorkHistoryFilter)
✅ 3 screens theo role (Employee, BranchManager, Admin)
✅ Filter theo: shift, date range
✅ Pagination support
✅ Role-based access control

## Format dữ liệu hiển thị

Mỗi record hiển thị:
- Tên nhân viên
- Ca làm việc (sáng/chiều)
- Ngày làm việc
- Chi nhánh
- Ghi chú (nếu có)
- Người tạo lịch
- Ngày tạo
`;
