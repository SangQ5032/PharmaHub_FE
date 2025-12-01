import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useBranchPayrollSummary } from '../hooks/usePayroll';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

interface PayrollSummaryScreenProps {
  branchId?: string;
  month?: string;
  token?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PayrollSummaryScreen: React.FC<PayrollSummaryScreenProps> = ({
  branchId: initialBranchId,
  month: initialMonth,
  token: initialToken,
}) => {
  const route = useRoute();
  const authUser = useAuthStore(state => state.user);
  const authToken = useAuthStore(state => state.accessToken);

  const branchId =
    initialBranchId || (route.params as any)?.branchId || authUser?.branch_id;
  const month = initialMonth || (route.params as any)?.month || '2024-11';
  const token = initialToken || authToken || '';

  const { data: summaryResponse, isLoading } = useBranchPayrollSummary(
    branchId || '',
    month,
  );

  const summary = summaryResponse?.data;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.monthText}>{month}</Text>
          <Text style={styles.totalPayrollText}>
            {formatCurrency(summary.total_payroll)}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.totalCard]}>
            <Text style={styles.statLabel}>Tổng người</Text>
            <Text style={styles.statValue}>{summary.count}</Text>
          </View>

          <View style={[styles.statCard, styles.approvedCard]}>
            <Text style={styles.statLabel}>Đã duyệt</Text>
            <Text style={styles.statValue}>{summary.approved_count}</Text>
          </View>

          <View style={[styles.statCard, styles.pendingCard]}>
            <Text style={styles.statLabel}>Chờ duyệt</Text>
            <Text style={styles.statValue}>{summary.pending_count}</Text>
          </View>

          <View style={[styles.statCard, styles.rejectedCard]}>
            <Text style={styles.statLabel}>Từ chối</Text>
            <Text style={styles.statValue}>{summary.rejected_count}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái xử lý:</Text>
            <Text style={styles.infoValue}>
              {summary.approved_count}/{summary.count} (
              {((summary.approved_count / summary.count) * 100).toFixed(0)}%)
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chờ xử lý:</Text>
            <Text style={styles.infoValue}>
              {summary.pending_count}/{summary.count}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Từ chối:</Text>
            <Text style={styles.infoValue}>
              {summary.rejected_count}/{summary.count}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  headerSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalPayrollText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1976d2',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  totalCard: {
    backgroundColor: '#e3f2fd',
  },
  approvedCard: {
    backgroundColor: '#f1f8e9',
  },
  pendingCard: {
    backgroundColor: '#fff3e0',
  },
  rejectedCard: {
    backgroundColor: '#ffebee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
