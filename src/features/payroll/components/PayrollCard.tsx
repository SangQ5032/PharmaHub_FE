import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { PayrollDetail, PayrollStatus } from '../types';

interface PayrollCardProps {
  payroll: PayrollDetail;
  onPress?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  userRole?: string; // 'employee', 'system_admin', 'branch_manager', etc.
}

const getStatusColor = (status: PayrollStatus): string => {
  switch (status) {
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#f44336';
    case 'pending':
    default:
      return '#FF9800';
  }
};

const getStatusText = (status: PayrollStatus): string => {
  switch (status) {
    case 'approved':
      return 'Đã duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'pending':
    default:
      return 'Chờ duyệt';
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const PayrollCard: React.FC<PayrollCardProps> = ({
  payroll,
  onPress,
  onApprove,
  onReject,
  showActions = false,
  canApprove = false,
  canReject = false,
  userRole = 'employee',
}) => {
  // Handle user_id which can be string or object
  const user =
    typeof payroll.user_id === 'string'
      ? { name: 'Unknown', _id: payroll.user_id }
      : payroll.user_id;

  // Handle branch_id which can be string or object
  const branch =
    typeof payroll.branch_id === 'string'
      ? { name: 'Unknown', _id: payroll.branch_id }
      : payroll.branch_id;

  // Get user name - try different possible name fields
  const userName =
    (user as any)?.fullName ||
    (user as any)?.name ||
    (user as any)?.username ||
    'Unknown';
  const userPhone = (user as any)?.contact?.phone || (user as any)?.phone || '';
  const userEmail = (user as any)?.contact?.email || (user as any)?.email || '';

  // Get branch name and address
  const branchName = (branch as any)?.name || 'Unknown';
  const branchAddress = (branch as any)?.address || '';

  return (
    <Pressable
      style={[styles.container, onPress && styles.pressable]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          {userPhone && <Text style={styles.userPhone}>{userPhone}</Text>}
          {userEmail && <Text style={styles.userEmail}>{userEmail}</Text>}
          <Text style={styles.branchName}>Chi nhánh: {branchName}</Text>
          {branchAddress && (
            <Text style={styles.branchAddress}>{branchAddress}</Text>
          )}
          <Text style={styles.month}>Tháng: {payroll.month}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(payroll.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(payroll.status)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Lương cơ bản:</Text>
          <Text style={styles.value}>
            {formatCurrency(payroll.base_salary)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Doanh số:</Text>
          <Text style={styles.value}>
            {formatCurrency(payroll.sales_amount)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phạt:</Text>
          <Text style={[styles.value, styles.penalty]}>
            -{formatCurrency(payroll.penalty_amount)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Thưởng:</Text>
          <Text style={[styles.value, styles.bonus]}>
            +{formatCurrency(payroll.bonus_amount)}
          </Text>
        </View>

        <View style={[styles.row, styles.finalRow]}>
          <Text style={styles.finalLabel}>
            {userRole === 'employee' ? 'Tổng nhận được:' : 'Tổng lương:'}
          </Text>
          <Text style={styles.finalValue}>
            {formatCurrency(payroll.final_salary)}
          </Text>
        </View>

        {/* Display shift information if available */}
        {(payroll.total_shifts !== undefined ||
          payroll.completed_shifts !== undefined ||
          payroll.late_count !== undefined) && (
          <>
            <View style={styles.divider} />
            <View style={styles.shiftInfo}>
              {payroll.total_shifts !== undefined && (
                <View style={styles.shiftRow}>
                  <Text style={styles.shiftLabel}>Tổng ca:</Text>
                  <Text style={styles.shiftValue}>{payroll.total_shifts}</Text>
                </View>
              )}
              {payroll.completed_shifts !== undefined && (
                <View style={styles.shiftRow}>
                  <Text style={styles.shiftLabel}>Ca hoàn thành:</Text>
                  <Text style={styles.shiftValue}>
                    {payroll.completed_shifts}
                  </Text>
                </View>
              )}
              {payroll.late_count !== undefined && (
                <View style={styles.shiftRow}>
                  <Text style={styles.shiftLabel}>Số lần trễ:</Text>
                  <Text style={[styles.shiftValue, styles.lateWarning]}>
                    {payroll.late_count}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>

      {showActions && (canApprove || canReject) && (
        <>
          <View style={styles.divider} />
          <View style={styles.actions}>
            {canApprove && (
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={onApprove}
              >
                <Text style={styles.actionButtonText}>Duyệt</Text>
              </TouchableOpacity>
            )}
            {canReject && (
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={onReject}
              >
                <Text style={styles.actionButtonText}>Từ chối</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pressable: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  branchAddress: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  month: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  penalty: {
    color: '#f44336',
  },
  bonus: {
    color: '#4CAF50',
  },
  finalRow: {
    marginBottom: 0,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  finalLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  finalValue: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  shiftInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  shiftLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  shiftValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  lateWarning: {
    color: '#ff9800',
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
