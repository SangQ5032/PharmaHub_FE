// src/features/warehouse/screens/ImportDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useGetImportDetail,
  useUpdateImportStatus,
  useCancelImport,
} from '@features/warehouse/hooks/useImports';

interface RouteParams {
  id: string;
}

export default function ImportDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  // Fetch import detail
  const { data, isLoading, error, refetch } = useGetImportDetail(id);
  const importRecord = data?.data;

  // Status update and cancel mutations
  const updateStatusMutation = useUpdateImportStatus();
  const cancelImportMutation = useCancelImport();

  // Handle update status
  const handleUpdateStatus = (
    newStatus: 'pending' | 'completed' | 'cancelled',
  ) => {
    if (!importRecord) return;

    if (importRecord.status === newStatus) {
      Alert.alert(
        'Thông báo',
        `Phiếu nhập đã ở trạng thái "${getStatusLabel(newStatus)}"`,
      );
      return;
    }

    const message =
      newStatus === 'completed'
        ? 'Xác nhận hoàn thành phiếu nhập?'
        : newStatus === 'pending'
        ? 'Xác nhận chuyển về chờ xử lý?'
        : 'Xác nhận hủy phiếu nhập?';

    Alert.alert('Xác nhận', message, [
      { text: 'Hủy', onPress: () => {} },
      {
        text: 'Xác nhận',
        onPress: async () => {
          try {
            await updateStatusMutation.mutateAsync({
              id: importRecord._id,
              body: { status: newStatus },
            });
            Alert.alert('Thành công', 'Cập nhật trạng thái thành công');
          } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Không thể cập nhật trạng thái');
          }
        },
      },
    ]);
  };

  // Handle cancel import
  const handleCancelImport = () => {
    if (!importRecord) return;

    if (importRecord.status === 'cancelled') {
      Alert.alert('Thông báo', 'Phiếu nhập này đã bị hủy');
      return;
    }

    Alert.prompt(
      'Hủy phiếu nhập',
      'Vui lòng nhập lý do hủy phiếu nhập',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async (reason: string | undefined) => {
            if (!reason || !reason.trim()) {
              Alert.alert('Lỗi', 'Lý do hủy không được để trống');
              return;
            }

            try {
              await cancelImportMutation.mutateAsync({
                id: importRecord._id,
                body: { reason: reason.trim() },
              });
              Alert.alert('Thành công', 'Hủy phiếu nhập thành công');
            } catch (err: any) {
              Alert.alert('Lỗi', err.message || 'Không thể hủy phiếu nhập');
            }
          },
        },
      ],
      'plain-text',
    );
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // Error state
  if (error || !importRecord) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết phiếu nhập</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status badge */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(importRecord.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(importRecord.status)}
              </Text>
            </View>
            <Text style={styles.sectionTitle}>ID: {importRecord._id}</Text>
          </View>
        </View>

        {/* Branch and Supplier info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chi nhánh:</Text>
            <Text style={styles.infoValue}>
              {importRecord.branch_id?.name || 'N/A'}
            </Text>
          </View>

          {importRecord.branch_id?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ chi nhánh:</Text>
              <Text style={styles.infoValue}>
                {importRecord.branch_id.address}
              </Text>
            </View>
          )}

          {importRecord.branch_id?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Điện thoại chi nhánh:</Text>
              <Text style={styles.infoValue}>
                {importRecord.branch_id.phone}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nhà cung cấp:</Text>
            <Text style={styles.infoValue}>
              {importRecord.supplier_id?.name || 'N/A'}
            </Text>
          </View>

          {importRecord.supplier_id?.contact && (
            <>
              {importRecord.supplier_id.contact.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Điện thoại NCC:</Text>
                  <Text style={styles.infoValue}>
                    {importRecord.supplier_id.contact.phone}
                  </Text>
                </View>
              )}
              {importRecord.supplier_id.contact.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email NCC:</Text>
                  <Text style={styles.infoValue}>
                    {importRecord.supplier_id.contact.email}
                  </Text>
                </View>
              )}
              {importRecord.supplier_id.contact.address && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Địa chỉ NCC:</Text>
                  <Text style={styles.infoValue}>
                    {importRecord.supplier_id.contact.address}
                  </Text>
                </View>
              )}
            </>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nhân viên:</Text>
            <Text style={styles.infoValue}>
              {importRecord.employee_id?.name ||
                importRecord.employee_id?.username ||
                'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày tạo:</Text>
            <Text style={styles.infoValue}>
              {formatDate(importRecord.createdAt)}
            </Text>
          </View>

          {importRecord.note && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú:</Text>
              <Text style={styles.infoValue}>{importRecord.note}</Text>
            </View>
          )}

          {importRecord.cancellation_reason && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Lý do hủy:</Text>
              <Text style={styles.infoValue}>
                {importRecord.cancellation_reason}
              </Text>
            </View>
          )}
        </View>

        {/* Items list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Danh sách thuốc ({importRecord.items.length})
          </Text>

          {importRecord.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.medicine_id?.name || 'N/A'}
                </Text>
              </View>

              <View style={styles.itemDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Số lượng:</Text>
                  <Text style={styles.detailValue}>
                    {item.quantity}{' '}
                    {item.unit || item.medicine_id?.unit || 'N/A'}
                    {item.quantity_in_base_unit &&
                      item.quantity_in_base_unit !== item.quantity && (
                        <Text style={styles.detailSubValue}>
                          {' '}
                          ({item.quantity_in_base_unit} đơn vị cơ bản)
                        </Text>
                      )}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Đơn giá:</Text>
                  <Text style={styles.detailValue}>
                    {formatCurrency(item.unit_price)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mã lô hàng:</Text>
                  <Text style={styles.detailValue}>{item.batch_number}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ngày hết hạn:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(item.expiry_date)}
                  </Text>
                </View>

                <View style={styles.detailRowTotal}>
                  <Text style={styles.detailLabelTotal}>Thành tiền:</Text>
                  <Text style={styles.detailValueTotal}>
                    {formatCurrency(item.quantity * item.unit_price)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Total cost */}
        <View style={styles.section}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng chi phí:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(importRecord.total_cost)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        {importRecord.status !== 'cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thao tác</Text>

            {importRecord.status === 'pending' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSuccess]}
                onPress={() => handleUpdateStatus('completed')}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    Hoàn thành phiếu nhập
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {importRecord.status === 'completed' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonWarning]}
                onPress={() => handleUpdateStatus('pending')}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    Chuyển về chờ xử lý
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={handleCancelImport}
              disabled={cancelImportMutation.isPending}
            >
              {cancelImportMutation.isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Hủy phiếu nhập</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  headerPlaceholder: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
    textAlign: 'right',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  itemDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  detailSubValue: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  detailRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailLabelTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  detailValueTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  actionButtonWarning: {
    backgroundColor: '#FF9800',
  },
  actionButtonDanger: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
