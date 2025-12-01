import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePayrollList } from '../hooks/usePayroll';
import { PayrollList } from '../components';
import { usePayrollStore } from '../stores/payrollStore';
import { PayrollDetail, PayrollStatus } from '../types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

interface BranchPayrollListScreenProps {
  token?: string;
  onSelectPayroll?: (payroll: PayrollDetail) => void;
  currentBranchId?: string;
  userRole?: string; // 'employee', 'system_admin', 'branch_manager', etc.
}

export const BranchPayrollListScreen: React.FC<
  BranchPayrollListScreenProps
> = ({
  token: initialToken,
  onSelectPayroll,
  currentBranchId: initialBranchId,
  userRole: initialUserRole,
}) => {
  const navigation = useNavigation();
  const authUser = useAuthStore(state => state.user);
  const authToken = useAuthStore(state => state.accessToken);

  // Sử dụng auth store nếu props không được truyền
  const token = initialToken || authToken || '';
  const userRole = initialUserRole || authUser?.role || 'branch_manager';
  const currentBranchId = initialBranchId || authUser?.branch_id;

  const { payrollFilters, setPayrollFilters } = usePayrollStore();
  const [refreshing, setRefreshing] = useState(false);

  // Local state for filters
  const [localMonth, setLocalMonth] = useState(payrollFilters.month || '');
  const [localStatus, setLocalStatus] = useState<PayrollStatus | undefined>(
    payrollFilters.status,
  );
  const [localUserId, setLocalUserId] = useState(payrollFilters.user_id || '');
  const [showFilters, setShowFilters] = useState(false);

  // Set initial filters based on branch
  useEffect(() => {
    if (currentBranchId) {
      setPayrollFilters({ branch_id: currentBranchId });
    }
  }, [currentBranchId, setPayrollFilters]);

  // Build filters for API
  const apiFilters = {
    branch_id: currentBranchId,
    ...(localMonth && { month: localMonth }),
    ...(localStatus && { status: localStatus }),
    ...(localUserId && { user_id: localUserId }),
    page: payrollFilters.page || 1,
    limit: payrollFilters.limit || 10,
  };

  const {
    data: payrollListResponse,
    isLoading,
    refetch,
  } = usePayrollList(apiFilters as any);

  const payrolls = Array.isArray(payrollListResponse?.data)
    ? payrollListResponse.data
    : [];
  const pagination = payrollListResponse?.pagination;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleApplyFilters = () => {
    setPayrollFilters({
      branch_id: currentBranchId,
      month: localMonth || undefined,
      status: localStatus,
      user_id: localUserId || undefined,
      page: 1,
    });
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setLocalMonth('');
    setLocalStatus(undefined);
    setLocalUserId('');
    setPayrollFilters({
      branch_id: currentBranchId,
      month: undefined,
      status: undefined,
      user_id: undefined,
      page: 1,
    });
    setShowFilters(false);
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

  // Calculate statistics
  const stats = {
    total: pagination?.total || 0,
    pending: payrolls.filter(p => p.status === 'pending').length,
    approved: payrolls.filter(p => p.status === 'approved').length,
    rejected: payrolls.filter(p => p.status === 'rejected').length,
    totalSalary: payrolls.reduce((sum, p) => sum + (p.final_salary || 0), 0),
  };

  return (
    <View style={styles.container}>
      {/* Header with stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tổng cộng</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View
          style={[
            styles.statBox,
            { borderLeftWidth: 1, borderLeftColor: '#eee' },
          ]}
        >
          <Text style={styles.statLabel}>Chờ duyệt</Text>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {stats.pending}
          </Text>
        </View>
        <View
          style={[
            styles.statBox,
            { borderLeftWidth: 1, borderLeftColor: '#eee' },
          ]}
        >
          <Text style={styles.statLabel}>Đã duyệt</Text>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {stats.approved}
          </Text>
        </View>
        <View
          style={[
            styles.statBox,
            { borderLeftWidth: 1, borderLeftColor: '#eee' },
          ]}
        >
          <Text style={styles.statLabel}>Từ chối</Text>
          <Text style={[styles.statValue, { color: '#f44336' }]}>
            {stats.rejected}
          </Text>
        </View>
      </View>

      {/* Total salary */}
      {stats.totalSalary > 0 && (
        <View style={styles.totalSalaryContainer}>
          <Text style={styles.totalSalaryLabel}>Tổng lương phải trả:</Text>
          <Text style={styles.totalSalaryValue}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
            }).format(stats.totalSalary)}
          </Text>
        </View>
      )}

      {/* Filter button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.filterButtonText}>
          {showFilters ? '▼ Ẩn bộ lọc' : '▶ Hiển thị bộ lọc'}
        </Text>
      </TouchableOpacity>

      {/* Filter panel */}
      {showFilters && (
        <ScrollView style={styles.filterPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Tháng (YYYY-MM)</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="2025-11"
              value={localMonth}
              onChangeText={setLocalMonth}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Trạng thái</Text>
            <View style={styles.statusContainer}>
              {(['pending', 'approved', 'rejected'] as PayrollStatus[]).map(
                s => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.statusButton,
                      localStatus === s && styles.statusButtonActive,
                    ]}
                    onPress={() =>
                      setLocalStatus(localStatus === s ? undefined : s)
                    }
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        localStatus === s && styles.statusButtonTextActive,
                      ]}
                    >
                      {s === 'pending'
                        ? 'Chờ duyệt'
                        : s === 'approved'
                        ? 'Đã duyệt'
                        : 'Từ chối'}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>User ID</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="ID nhân viên"
              value={localUserId}
              onChangeText={setLocalUserId}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>Xoá lọc</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Payroll list */}
      <View style={{ flex: 1 }}>
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

      {/* Pagination info */}
      {pagination && pagination.pages > 1 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>
            Trang {pagination.page} / {pagination.pages}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
  },
  totalSalaryContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalSalaryLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  totalSalaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },
  filterPanel: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    maxHeight: 350,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
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
  paginationContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  paginationText: {
    fontSize: 12,
    color: '#999',
  },
});
