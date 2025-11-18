// src/features/warehouse/screens/InventoryDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetInventoryDetail } from '@features/warehouse/hooks/useInventory';
import { StatusBadge } from '@features/warehouse/components/StatusBadge';

export default function InventoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  // Fetch inventory detail
  const { data, isLoading, isError, error, refetch } =
    useGetInventoryDetail(id);

  // Get status based on quantity and warning threshold
  const getStatus = (): 'normal' | 'low' | 'out_of_stock' => {
    if (!data?.data) return 'normal';
    const item = data.data;

    if (item.quantity === 0) return 'out_of_stock';
    if (
      item.medicine?.warning_threshold &&
      item.quantity <= item.medicine.warning_threshold
    ) {
      return 'low';
    }
    return 'normal';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Render loading
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết tồn kho</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  // Render error
  if (isError || !data?.data) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết tồn kho</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || 'Không thể tải dữ liệu'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const item = data.data;
  const status = getStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tồn kho</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Medicine Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin thuốc</Text>
            <StatusBadge status={status} size="medium" />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên thuốc:</Text>
            <Text style={styles.value}>{item.medicine?.name || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Danh mục:</Text>
            <Text style={styles.value}>{item.medicine?.category || 'N/A'}</Text>
          </View>

          {item.medicine?.description && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mô tả:</Text>
              <Text style={styles.value}>{item.medicine.description}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị:</Text>
            <Text style={styles.value}>{item.medicine?.unit || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá:</Text>
            <Text style={[styles.value, styles.priceValue]}>
              {item.medicine?.price
                ? formatCurrency(item.medicine.price)
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Hạn sử dụng:</Text>
            <Text style={styles.value}>
              {item.medicine?.expiry_date
                ? formatDate(item.medicine.expiry_date)
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Inventory Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin tồn kho</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Chi nhánh:</Text>
            <Text style={styles.value}>{item.branch?.name || 'N/A'}</Text>
          </View>

          {item.branch?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={styles.value}>{item.branch.address}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng tồn:</Text>
            <Text
              style={[
                styles.value,
                styles.quantityValue,
                status === 'out_of_stock' && styles.errorValue,
                status === 'low' && styles.warningValue,
                status === 'normal' && styles.successValue,
              ]}
            >
              {item.quantity} {item.medicine?.unit || ''}
            </Text>
          </View>

          {item.medicine?.warning_threshold && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngưỡng cảnh báo:</Text>
              <Text style={styles.value}>
                {item.medicine.warning_threshold} {item.medicine.unit}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Cập nhật lần cuối:</Text>
            <Text style={styles.value}>{formatDate(item.last_updated)}</Text>
          </View>
        </View>

        {/* Total Value Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Giá trị tồn kho</Text>

          <View style={styles.totalValueContainer}>
            <Text style={styles.totalValueLabel}>Tổng giá trị:</Text>
            <Text style={styles.totalValueAmount}>
              {item.medicine?.price
                ? formatCurrency(item.quantity * item.medicine.price)
                : 'N/A'}
            </Text>
          </View>

          <Text style={styles.totalValueNote}>
            = {item.quantity} {item.medicine?.unit} ×{' '}
            {item.medicine?.price ? formatCurrency(item.medicine.price) : 'N/A'}
          </Text>
        </View>
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
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  priceValue: {
    color: '#4CAF50',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  successValue: {
    color: '#4CAF50',
  },
  warningValue: {
    color: '#FF9800',
  },
  errorValue: {
    color: '#F44336',
  },
  totalValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalValueLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalValueAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  totalValueNote: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'right',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
