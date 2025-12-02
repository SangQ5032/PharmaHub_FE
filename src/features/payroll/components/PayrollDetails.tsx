import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { PayrollDetail } from '../types';

interface PayrollDetailsProps {
  payroll: PayrollDetail | null;
  loading?: boolean;
  onApprove?: (note?: string) => void;
  onReject?: (reason?: string) => void;
  canApprove?: boolean;
  canReject?: boolean;
  approvingLoading?: boolean;
  rejectingLoading?: boolean;
  userRole?: string; // 'employee', 'system_admin', 'branch_manager', etc.
}

const { width } = Dimensions.get('window');

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status: string): string => {
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

const getStatusText = (status: string): string => {
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

export const PayrollDetails: React.FC<PayrollDetailsProps> = ({
  payroll,
  loading = false,
  onApprove,
  onReject,
  canApprove = false,
  canReject = false,
  approvingLoading = false,
  rejectingLoading = false,
  userRole = 'employee',
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (!payroll) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu</Text>
      </View>
    );
  }

  // Handle user_id and branch_id as objects or strings
  const user = typeof payroll.user_id === 'object' ? payroll.user_id : null;
  const branch =
    typeof payroll.branch_id === 'object' ? payroll.branch_id : null;

  // Safe get user info with fallbacks
  const userName = user
    ? user.fullName || user.name || user.username || 'Unknown'
    : 'Unknown';
  const userPhone = user ? user.phone || user.contact?.phone || '' : '';
  const userEmail = user ? user.email || user.contact?.email || '' : '';
  const branchName = branch ? branch.name || 'Unknown' : 'Unknown';
  const branchAddress = branch ? branch.address || '' : '';

  const handleApprove = () => {
    Alert.alert('Duyệt lương', 'Bạn chắc chắn muốn duyệt lương này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Duyệt',
        onPress: () => onApprove?.(),
        style: 'default',
      },
    ]);
  };

  const handleRejectPress = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do từ chối');
      return;
    }
    setShowRejectModal(false);
    onReject?.(rejectReason);
    setRejectReason('');
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Card - Employee Info */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{userName}</Text>
              <Text style={styles.employeePhone}>{userPhone}</Text>
              <Text style={styles.employeeEmail}>{userEmail}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(payroll.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(payroll.status)}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.headerBottom}>
            <View>
              <Text style={styles.labelSmall}>Chi nhánh</Text>
              <Text style={styles.valueSmall}>{branchName}</Text>
              {branchAddress && (
                <Text style={styles.addressSmall}>{branchAddress}</Text>
              )}
            </View>
            <View style={styles.monthBadge}>
              <Text style={styles.monthText}>{payroll.month}</Text>
            </View>
          </View>
        </View>

        {/* Salary Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Lương cơ bản</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(payroll.base_salary)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              {userRole === 'employee' ? 'Tổng nhận được' : 'Tổng phải trả'}
            </Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(payroll.final_salary)}
            </Text>
          </View>
        </View>

        {/* Attendance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Chấm công</Text>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tổng ca</Text>
              <Text style={styles.gridValue}>{payroll.total_shifts}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ca hoàn thành</Text>
              <Text style={styles.gridValue}>{payroll.completed_shifts}</Text>
            </View>
          </View>
          <View style={styles.twoColumnGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Số lần muộn</Text>
              <Text style={[styles.gridValue, { color: '#FF9800' }]}>
                {payroll.late_count}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Tỷ lệ hoàn thành</Text>
              <Text style={styles.gridValue}>
                {payroll.total_shifts > 0
                  ? (
                      (payroll.completed_shifts / payroll.total_shifts) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Chi tiết lương</Text>
          <View style={styles.breakdownContainer}>
            {/* Lương cơ bản */}
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Lương cơ bản</Text>
              <Text style={styles.breakdownValue}>
                {formatCurrency(payroll.base_salary)}
              </Text>
            </View>

            {/* Doanh số */}
            {payroll.sales_amount > 0 && (
              <View style={[styles.breakdownRow, styles.positiveRow]}>
                <Text style={styles.breakdownLabel}>Doanh số bán hàng</Text>
                <Text style={styles.positiveValue}>
                  +{formatCurrency(payroll.sales_amount)}
                </Text>
              </View>
            )}

            {/* Thưởng */}
            {payroll.bonus_amount > 0 && (
              <View style={[styles.breakdownRow, styles.bonusRowBg]}>
                <Text style={styles.breakdownLabel}>Thưởng</Text>
                <Text style={styles.bonusValue}>
                  +{formatCurrency(payroll.bonus_amount)}
                </Text>
              </View>
            )}

            {/* Phạt */}
            {payroll.penalty_amount > 0 && (
              <View style={[styles.breakdownRow, styles.penaltyRowBg]}>
                <Text style={styles.breakdownLabel}>Phạt</Text>
                <Text style={styles.penaltyValue}>
                  -{formatCurrency(payroll.penalty_amount)}
                </Text>
              </View>
            )}

            {/* Tổng lương */}
            <View style={styles.totalBreakdownRow}>
              {userRole === 'employee' ? (
                <>
                  <Text style={styles.totalBreakdownLabel}>
                    Tổng lương nhận được
                  </Text>
                  <Text style={styles.totalBreakdownValue}>
                    {formatCurrency(payroll.final_salary)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.totalBreakdownLabel}>
                    Tổng lương phải trả
                  </Text>
                  <Text style={styles.totalBreakdownValue}>
                    {formatCurrency(payroll.final_salary)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Status & Approval Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Trạng thái duyệt</Text>
          <View style={styles.statusInfo}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Trạng thái hiện tại:</Text>
              <View
                style={[
                  styles.statusBadgeSmall,
                  { backgroundColor: getStatusColor(payroll.status) },
                ]}
              >
                <Text style={styles.statusTextSmall}>
                  {getStatusText(payroll.status)}
                </Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Ngày tạo:</Text>
              <Text style={styles.statusValue}>
                {formatDateTime(payroll.createdAt)}
              </Text>
            </View>

            {payroll.approved_at && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Ngày duyệt:</Text>
                <Text style={styles.statusValue}>
                  {formatDateTime(payroll.approved_at)}
                </Text>
              </View>
            )}

            {payroll.approved_by && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Người duyệt:</Text>
                <Text style={styles.statusValue}>
                  {typeof payroll.approved_by === 'object'
                    ? payroll.approved_by.fullName ||
                      payroll.approved_by.name ||
                      payroll.approved_by.username ||
                      'Unknown'
                    : payroll.approved_by}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notes Section */}
        {payroll.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Ghi chú</Text>
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{payroll.note}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {(canApprove || canReject) && payroll.status === 'pending' && (
          <View style={styles.actionsContainer}>
            {canApprove && (
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={approvingLoading}
              >
                {approvingLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>✓ Duyệt</Text>
                )}
              </TouchableOpacity>
            )}
            {canReject && (
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleRejectPress}
                disabled={rejectingLoading}
              >
                {rejectingLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>✕ Từ chối</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Reject Reason Modal */}
        <Modal
          visible={showRejectModal}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelReject}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nhập lý do từ chối</Text>
              <Text style={styles.modalSubtitle}>
                Vui lòng nhập lý do chi tiết cho việc từ chối bảng lương này
              </Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Lý do từ chối..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={5}
                value={rejectReason}
                onChangeText={setRejectReason}
                textAlignVertical="top"
              />
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelReject}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmReject}
                  disabled={!rejectReason.trim()}
                >
                  <Text style={styles.confirmButtonText}>Xác nhận từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    paddingBottom: 24,
  },

  // Header Card
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
    marginRight: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  employeePhone: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  employeeEmail: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelSmall: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  valueSmall: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  addressSmall: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  monthBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  monthText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '600',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },

  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },

  // Grid Layout
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  gridLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  gridValue: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: '700',
  },

  // Breakdown
  breakdownContainer: {
    marginTop: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  positiveRow: {
    backgroundColor: '#f1f8e9',
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  positiveValue: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  bonusRowBg: {
    backgroundColor: '#f1f8e9',
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  bonusValue: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  penaltyRowBg: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    borderBottomWidth: 0,
  },
  penaltyValue: {
    color: '#f44336',
    fontWeight: '600',
  },
  totalBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  totalBreakdownLabel: {
    fontSize: 15,
    color: '#1976d2',
    fontWeight: '700',
  },
  totalBreakdownValue: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '700',
  },

  // Status Info
  statusInfo: {
    marginTop: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusBadgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusTextSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Note
  noteContainer: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Empty State
  emptyText: {
    fontSize: 16,
    color: '#999',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 100,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#f44336',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
