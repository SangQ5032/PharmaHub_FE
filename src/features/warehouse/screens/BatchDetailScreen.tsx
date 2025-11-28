// src/features/warehouse/screens/BatchDetailScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Batch } from '@features/warehouse/types/inventory.types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BatchDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const batch = route.params?.batch as Batch | undefined;

  if (!batch) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết lô hàng</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Không có dữ liệu lô hàng</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return 'Chưa xác định';
    }
  };

  const isExpired = new Date(batch.expiry_date) < new Date();
  const isExpiringSoon =
    !isExpired &&
    new Date(batch.expiry_date) <
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết lô hàng</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Batch Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin lô hàng</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(batch.status) },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {getStatusLabel(batch.status)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Lô hàng:</Text>
            <Text style={[styles.value, styles.batchNumberValue]}>
              {batch.batch_number}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Hạn sử dụng:</Text>
            <Text
              style={[
                styles.value,
                isExpired && styles.expiredValue,
                isExpiringSoon && !isExpired && styles.expiringSoonValue,
              ]}
            >
              {formatDate(batch.expiry_date)}
              {isExpired && ' (Hết hạn)'}
              {isExpiringSoon && !isExpired && ' (Sắp hết)'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng tồn:</Text>
            <Text
              style={[
                styles.value,
                styles.quantityValue,
                batch.quantity === 0 && styles.quantityEmpty,
                batch.quantity < 10 && batch.quantity > 0 && styles.quantityLow,
              ]}
            >
              {batch.quantity}
            </Text>
          </View>

          {batch.initial_quantity && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số lượng nhập ban đầu:</Text>
              <Text style={styles.value}>{batch.initial_quantity}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá nhập:</Text>
            <Text style={[styles.value, styles.priceValue]}>
              {formatCurrency(batch.import_price)}
            </Text>
          </View>

          {batch.batch_value && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giá trị lô:</Text>
              <Text style={[styles.value, styles.priceValue]}>
                {formatCurrency(batch.batch_value)}
              </Text>
            </View>
          )}
        </View>

        {/* Supplier Info Card */}
        {batch.supplier && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin nhà cung cấp</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên nhà cung cấp:</Text>
              <Text style={styles.value}>{batch.supplier.name}</Text>
            </View>

            {batch.supplier_id && typeof batch.supplier_id === 'string' && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Mã nhà cung cấp:</Text>
                <Text style={styles.value}>{batch.supplier_id}</Text>
              </View>
            )}
          </View>
        )}

        {/* Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lịch sử</Text>

          {batch.imported_at && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Ngày nhập hàng</Text>
                <Text style={styles.timelineValue}>
                  {formatDate(batch.imported_at)}
                </Text>
              </View>
            </View>
          )}

          {batch.createdAt && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Ngày tạo bản ghi</Text>
                <Text style={styles.timelineValue}>
                  {formatDate(batch.createdAt)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tóm tắt</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Icon name="package" size={24} color="#2196F3" />
              <Text style={styles.summaryLabel}>Tổng giá trị</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(
                  batch.batch_value || batch.quantity * batch.import_price,
                )}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Icon
                name={batch.quantity > 0 ? 'check-circle' : 'alert-circle'}
                size={24}
                color={batch.quantity > 0 ? '#4CAF50' : '#F44336'}
              />
              <Text style={styles.summaryLabel}>Tình trạng</Text>
              <Text
                style={[
                  styles.summaryValue,
                  batch.quantity === 0 && styles.quantityEmptyText,
                  batch.quantity > 0 && styles.quantityOkText,
                ]}
              >
                {batch.quantity > 0 ? 'Còn hàng' : 'Hết'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Icon
                name={isExpired ? 'alert-circle' : 'calendar-check'}
                size={24}
                color={isExpired ? '#F44336' : '#4CAF50'}
              />
              <Text style={styles.summaryLabel}>Hạn dùng</Text>
              <Text
                style={[
                  styles.summaryValue,
                  isExpired && styles.expiredText,
                  !isExpired && styles.validText,
                ]}
              >
                {isExpired ? 'Hết hạn' : 'Còn dùng'}
              </Text>
            </View>
          </View>
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
  headerSpacer: {
    width: 80,
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
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
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  batchNumberValue: {
    fontSize: 18,
    color: '#2196F3',
  },
  priceValue: {
    color: '#4CAF50',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  quantityEmpty: {
    color: '#F44336',
  },
  quantityLow: {
    color: '#FF9800',
  },
  expiredValue: {
    color: '#F44336',
  },
  expiringSoonValue: {
    color: '#FF9800',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
  },
  quantityEmptyText: {
    color: '#F44336',
  },
  quantityOkText: {
    color: '#4CAF50',
  },
  expiredText: {
    color: '#F44336',
  },
  validText: {
    color: '#4CAF50',
  },
});
