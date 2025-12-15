// src/features/warehouse/screens/BatchDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetBatchDetail } from '@features/warehouse/hooks/useBatches';

interface RouteParams {
  id: string;
}

export default function BatchDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as RouteParams;

  const { data: response, isLoading, error } = useGetBatchDetail(id);
  const batch = response?.data;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: batch?.batch_number || 'Chi tiết lô hàng',
      headerBackTitle: 'Lô hàng',
    });
  }, [navigation, batch]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !batch) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#F44336"
          />
          <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isExpired = new Date(batch.expiry_date) < new Date();
  const daysToExpiry = Math.ceil(
    (new Date(batch.expiry_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'expired':
        return '#F44336';
      case 'discontinued':
        return '#9E9E9E';
      case 'sold_out':
        return '#FF9800';
      default:
        return '#4CAF50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'expired':
        return 'Hết hạn';
      case 'discontinued':
        return 'Ngừng bán';
      case 'sold_out':
        return 'Hết hàng';
      default:
        return 'Không rõ';
    }
  };

  const statusColor = getStatusColor(batch.status);
  const statusLabel = getStatusLabel(batch.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Batch Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin lô hàng</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã lô:</Text>
            <Text style={styles.value}>{batch.batch_number}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Thuốc:</Text>
            <Text style={styles.value}>{batch.medicine?.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị:</Text>
            <Text style={styles.value}>{batch.medicine?.unit}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nhà sản xuất:</Text>
            <Text style={styles.value}>
              {batch.medicine?.manufacturer || 'Không rõ'}
            </Text>
          </View>
        </View>

        {/* Quantity Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin số lượng</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng nhập:</Text>
            <Text style={styles.value}>{batch.initial_quantity}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng hiện tại:</Text>
            <Text style={[styles.value, styles.currentQuantity]}>
              {batch.quantity}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đã bán:</Text>
            <Text style={styles.value}>
              {batch.initial_quantity - batch.quantity}
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((batch.initial_quantity - batch.quantity) /
                        batch.initial_quantity) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(
                ((batch.initial_quantity - batch.quantity) /
                  batch.initial_quantity) *
                  100,
              )}
              % đã bán
            </Text>
          </View>
        </View>

        {/* Price Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin giá</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá nhập:</Text>
            <Text style={styles.value}>
              ₫{batch.import_price?.toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá bán lẻ:</Text>
            <Text style={styles.value}>
              ₫
              {(
                batch.retail_price ||
                batch.retail_price_for_base_unit ||
                batch.medicine?.retail_price ||
                0
              ).toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Lợi nhuận / viên:</Text>
            <Text style={styles.profitValue}>
              ₫
              {(
                (batch.retail_price ||
                  batch.retail_price_for_base_unit ||
                  batch.medicine?.retail_price ||
                  0) - (batch.import_price || 0)
              ).toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng giá nhập:</Text>
            <Text style={styles.value}>
              ₫
              {(batch.import_price * batch.initial_quantity).toLocaleString(
                'vi-VN',
              )}
            </Text>
          </View>
        </View>

        {/* Expiry Date Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hạn sử dụng</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Hạn sử dụng:</Text>
            <Text style={[styles.value, isExpired && styles.expiredText]}>
              {new Date(batch.expiry_date).toLocaleDateString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tình trạng:</Text>
            <Text
              style={[
                styles.value,
                isExpired && styles.expiredText,
                !isExpired && daysToExpiry < 30 && styles.warningText,
              ]}
            >
              {isExpired ? 'Đã hết hạn' : `Còn ${daysToExpiry} ngày`}
            </Text>
          </View>
        </View>

        {/* Supplier Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin nhà cung cấp</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nhà cung cấp:</Text>
            <Text style={styles.value}>{batch.supplier?.name}</Text>
          </View>

          {batch.supplier?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{batch.supplier.address}</Text>
            </View>
          )}

          {batch.supplier?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Điện thoại:</Text>
              <Text style={styles.value}>{batch.supplier.phone}</Text>
            </View>
          )}
        </View>

        {/* Branch Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi nhánh</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên chi nhánh:</Text>
            <Text style={styles.value}>{batch.branch?.name}</Text>
          </View>

          {batch.branch?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{batch.branch.address}</Text>
            </View>
          )}
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ngày tháng</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>
              {new Date(batch.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {batch.updatedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cập nhật:</Text>
              <Text style={styles.value}>
                {new Date(batch.updatedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  currentQuantity: {
    color: '#4CAF50',
    fontSize: 14,
  },
  profitValue: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  expiredText: {
    color: '#F44336',
  },
  warningText: {
    color: '#FF9800',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 11,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#F44336',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
