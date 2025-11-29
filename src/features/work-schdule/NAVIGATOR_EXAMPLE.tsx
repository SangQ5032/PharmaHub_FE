// /**
//  * Ví dụ cách tích hợp Work Schedule History vào AppNavigator
//  *
//  * File: src/app/navigation/AppNavigator.tsx
//  *
//  * Đây chỉ là ví dụ, hãy thích ứng theo cấu trúc Navigator hiện tại của bạn
//  */

// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useAuthStore } from '@features/auth/stores/useAuthStore';
// import { ROUTES } from '@shared/constants/routes';

// // Import Work Schedule History Screens
// import {
//   EmployeeWorkHistoryScreen,
//   BranchWorkHistoryScreen,
//   AdminWorkHistoryScreen,
// } from '@features/work-schdule';

// // ... các import khác

// const Stack = createNativeStackNavigator();

// /**
//  * MainStack hoặc AppStack - chứa các screen chung
//  */
// export const MainStack = () => {
//   const user = useAuthStore((state) => state.user);
//   const userRole = user?.role;

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerBackTitleVisible: false,
//       }}
//     >
//       {/* Screen Work History History dựa trên role */}
//       {/* Employee - Xem lịch sử của chính mình */}
//       {userRole === 'employee' && (
//         <Stack.Screen
//           name={ROUTES.EMPLOYEE_WORK_HISTORY}
//           component={EmployeeWorkHistoryScreen}
//           options={{
//             title: 'Lịch sử làm việc của tôi',
//             headerShown: true,
//           }}
//         />
//       )}

//       {/* Branch Manager - Xem lịch sử nhân viên trong chi nhánh */}
//       {(userRole === 'branch_manager' || userRole === 'branch-manager') && (
//         <Stack.Screen
//           name={ROUTES.BRANCH_WORK_HISTORY}
//           component={BranchWorkHistoryScreen}
//           options={{
//             title: 'Lịch sử làm việc chi nhánh',
//             headerShown: true,
//           }}
//         />
//       )}

//       {/* System Admin - Xem lịch sử làm việc toàn hệ thống */}
//       {(userRole === 'system_admin' || userRole === 'system-admin') && (
//         <Stack.Screen
//           name={ROUTES.ADMIN_WORK_HISTORY}
//           component={AdminWorkHistoryScreen}
//           options={{
//             title: 'Lịch sử làm việc toàn hệ thống',
//             headerShown: true,
//           }}
//         />
//       )}

//       {/* Các screens khác */}
//       {/* ... */}
//     </Stack.Navigator>
//   );
// };

// /**
//  * HOẶC: Nếu bạn chia riêng stacks theo role
//  */

// export const EmployeeStack = () => {
//   return (
//     <Stack.Navigator>
//       {/* ... */}
//       <Stack.Screen
//         name={ROUTES.EMPLOYEE_WORK_HISTORY}
//         component={EmployeeWorkHistoryScreen}
//         options={{
//           title: 'Lịch sử làm việc của tôi',
//           headerShown: true,
//         }}
//       />
//       {/* ... */}
//     </Stack.Navigator>
//   );
// };

// export const BranchManagerStack = () => {
//   return (
//     <Stack.Navigator>
//       {/* ... */}
//       <Stack.Screen
//         name={ROUTES.BRANCH_WORK_HISTORY}
//         component={BranchWorkHistoryScreen}
//         options={{
//           title: 'Lịch sử làm việc chi nhánh',
//           headerShown: true,
//         }}
//       />
//       {/* ... */}
//     </Stack.Navigator>
//   );
// };

// export const AdminStack = () => {
//   return (
//     <Stack.Navigator>
//       {/* ... */}
//       <Stack.Screen
//         name={ROUTES.ADMIN_WORK_HISTORY}
//         component={AdminWorkHistoryScreen}
//         options={{
//           title: 'Lịch sử làm việc toàn hệ thống',
//           headerShown: true,
//         }}
//       />
//       {/* ... */}
//     </Stack.Navigator>
//   );
// };

// /**
//  * Root Navigator - điều hướng dựa trên user role
//  */
// export const AppNavigator = () => {
//   const user = useAuthStore((state) => state.user);
//   const userRole = user?.role;

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {userRole === 'employee' && (
//         <Stack.Screen
//           name="EmployeeRoot"
//           component={EmployeeStack}
//         />
//       )}
//       {(userRole === 'branch_manager' || userRole === 'branch-manager') && (
//         <Stack.Screen
//           name="BranchManagerRoot"
//           component={BranchManagerStack}
//         />
//       )}
//       {(userRole === 'system_admin' || userRole === 'system-admin') && (
//         <Stack.Screen
//           name="AdminRoot"
//           component={AdminStack}
//         />
//       )}
//     </Stack.Navigator>
//   );
// };
