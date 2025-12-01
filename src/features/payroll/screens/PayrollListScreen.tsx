import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePayrollList, usePayrollPreview } from '../hooks/usePayroll';
import { PayrollList, PayrollFilter } from '../components';
import { usePayrollStore } from '../stores/payrollStore';
import { PayrollDetail } from '../types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

interface PayrollListScreenProps {
  token?: string;
  onSelectPayroll?: (payroll: PayrollDetail) => void;
  userRole?: string;
  currentUserId?: string;
  currentBranchId?: string;
}

export const PayrollListScreen: React.FC<PayrollListScreenProps> = ({
  token: initialToken,
  onSelectPayroll,
  userRole: initialUserRole,
  currentUserId: initialUserId,
  currentBranchId: initialBranchId,
}) => {
  const navigation = useNavigation();
  const authUser = useAuthStore(state => state.user);
  const authToken = useAuthStore(state => state.accessToken);

  // Sử dụng auth store nếu props không được truyền
  const token = initialToken || authToken || '';
  const userRole = initialUserRole || authUser?.role || 'employee';
  const currentUserId = initialUserId || authUser?._id || authUser?.id;
  const currentBranchId = initialBranchId || authUser?.branch_id;

  // Debug auth user
  React.useEffect(() => {
    console.log('=== Auth Info ===');
    console.log('authUser:', authUser);
    console.log('userRole:', userRole);
    console.log('currentUserId:', currentUserId);
    console.log('currentBranchId:', currentBranchId);
  }, [authUser, userRole, currentUserId, currentBranchId]);

  const { payrollFilters, setPayrollFilters } = usePayrollStore();
  const [refreshing, setRefreshing] = useState(false);

  // Set initial filters based on user role - also set default month
  useEffect(() => {
    // Get current month in YYYY-MM format
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, '0')}`;

    if (userRole === 'employee' && currentUserId) {
      setPayrollFilters({
        user_id: currentUserId,
        month: currentMonth,
        page: 1,
        limit: 10,
      });
    } else if (userRole === 'branch_manager' && currentBranchId) {
      setPayrollFilters({
        branch_id: currentBranchId,
        month: currentMonth,
        page: 1,
        limit: 10,
      });
    } else {
      // Fallback for admin role
      setPayrollFilters({
        month: currentMonth,
        page: 1,
        limit: 10,
      });
    }
  }, [userRole, currentUserId, currentBranchId, setPayrollFilters]);

  // Build filters for API
  const apiFilters = {
    ...(payrollFilters.branch_id && { branch_id: payrollFilters.branch_id }),
    ...(payrollFilters.month && { month: payrollFilters.month }),
    ...(payrollFilters.status && { status: payrollFilters.status }),
    ...(payrollFilters.user_id && { user_id: payrollFilters.user_id }),
    page: payrollFilters.page || 1,
    limit: payrollFilters.limit || 10,
  };

  const {
    data: payrollListResponse,
    isLoading,
    refetch,
  } = usePayrollList(apiFilters);

  // Extract payroll array from response
  // Response structure: { success, message, data: [...payrolls...], pagination }
  const payrolls = Array.isArray(payrollListResponse?.data)
    ? payrollListResponse.data
    : [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleFilterChange = (filters: {
    branchId?: string;
    month?: string;
    status?: string;
    userId?: string;
  }) => {
    setPayrollFilters({
      branch_id: filters.branchId,
      month: filters.month,
      status: filters.status as any,
      user_id: filters.userId,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setPayrollFilters({
      branch_id: userRole === 'branch_manager' ? currentBranchId : undefined,
      month: undefined,
      status: undefined,
      user_id: userRole === 'employee' ? currentUserId : undefined,
      page: 1,
    });
  };

  const handleSelectPayroll = (payroll: PayrollDetail) => {
    // Nếu có callback từ props, gọi nó
    if (onSelectPayroll) {
      onSelectPayroll(payroll);
      return;
    }

    // Nếu không, navigate tới chi tiết
    navigation.navigate(
      ROUTES.PAYROLL_DETAIL as never,
      {
        payrollId: payroll._id,
      } as never,
    );
  };

  return (
    <View style={styles.container}>
      <PayrollFilter
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <PayrollList
        payrolls={payrolls}
        loading={isLoading}
        onItemPress={handleSelectPayroll}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        userRole={userRole}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu lương</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
