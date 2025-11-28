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
import { useGetInventoryMedicineDetail } from '@features/warehouse/hooks/useInventory';
import { StatusBadge } from '@features/warehouse/components/StatusBadge';

export default function InventoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { medicineId, branchId } = route.params as {
    medicineId: string;
    branchId: string;
  };

  // Fetch inventory detail cho loại thuốc cụ thể tại chi nhánh
  const { data, isLoading, isError, error, refetch } =
    useGetInventoryMedicineDetail(branchId, medicineId);

  // Get status based on quantity and warning threshold
  const getStatus = (): 'sufficient' | 'low' | 'low_stock' | 'out_of_stock' => {
    if (!data?.data) return 'sufficient';
    const item = data.data;

    if (item.status) {
      return item.status as 'sufficient' | 'low' | 'low_stock' | 'out_of_stock';
    }

    if (item.total_quantity === 0) return 'out_of_stock';
    if (
      item.warning_threshold &&
      item.total_quantity <= item.warning_threshold
    ) {
      return 'low';
    }
    return 'sufficient';
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
          <View style={styles.headerSpacer} />
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
          <View style={styles.headerSpacer} />
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
        <View style={styles.headerSpacer} />
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

          {item.medicine?.generic_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hoạt chất:</Text>
              <Text style={styles.value}>{item.medicine.generic_name}</Text>
            </View>
          )}

          {item.medicine?.brand_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên thương hiệu:</Text>
              <Text style={styles.value}>{item.medicine.brand_name}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị:</Text>
            <Text style={styles.value}>{item.medicine?.unit || 'N/A'}</Text>
          </View>

          {item.medicine?.dosage_form && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dạng bào chế:</Text>
              <Text style={styles.value}>{item.medicine.dosage_form}</Text>
            </View>
          )}

          {item.medicine?.strength && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hàm lượng:</Text>
              <Text style={styles.value}>{item.medicine.strength}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá bán lẻ:</Text>
            <Text style={[styles.value, styles.priceValue]}>
              {item.medicine?.retail_price
                ? formatCurrency(item.medicine.retail_price)
                : 'N/A'}
            </Text>
          </View>

          {item.medicine?.manufacturer && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nhà sản xuất:</Text>
              <Text style={styles.value}>{item.medicine.manufacturer}</Text>
            </View>
          )}

          {item.medicine?.country_of_origin && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Xuất xứ:</Text>
              <Text style={styles.value}>
                {item.medicine.country_of_origin}
              </Text>
            </View>
          )}

          {item.medicine?.registration_number && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số đăng ký:</Text>
              <Text style={styles.value}>
                {item.medicine.registration_number}
              </Text>
            </View>
          )}

          {item.medicine?.barcode && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mã vạch:</Text>
              <Text style={styles.value}>{item.medicine.barcode}</Text>
            </View>
          )}
        </View>

        {/* Medical Details Card */}
        {(item.medicine?.indications ||
          item.medicine?.contraindications ||
          item.medicine?.side_effects ||
          item.medicine?.usage_instructions ||
          item.medicine?.storage_conditions) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin y học</Text>

            {item.medicine?.indications && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Chỉ định:</Text>
                <Text style={styles.value}>{item.medicine.indications}</Text>
              </View>
            )}

            {item.medicine?.contraindications && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Chống chỉ định:</Text>
                <Text style={styles.value}>
                  {item.medicine.contraindications}
                </Text>
              </View>
            )}

            {item.medicine?.side_effects && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Tác dụng phụ:</Text>
                <Text style={styles.value}>{item.medicine.side_effects}</Text>
              </View>
            )}

            {item.medicine?.usage_instructions && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Cách sử dụng:</Text>
                <Text style={styles.value}>
                  {item.medicine.usage_instructions}
                </Text>
              </View>
            )}

            {item.medicine?.storage_conditions && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Điều kiện bảo quản:</Text>
                <Text style={styles.value}>
                  {item.medicine.storage_conditions}
                </Text>
              </View>
            )}
          </View>
        )}

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

          {item.branch?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Điện thoại:</Text>
              <Text style={styles.value}>{item.branch.phone}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng số lượng tồn:</Text>
            <Text
              style={[
                styles.value,
                styles.quantityValue,
                status === 'out_of_stock' && styles.errorValue,
                (status === 'low' || status === 'low_stock') &&
                  styles.warningValue,
                status === 'sufficient' && styles.successValue,
              ]}
            >
              {item.total_quantity} {item.medicine?.unit || ''}
            </Text>
          </View>

          {item.warning_threshold && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngưỡng cảnh báo:</Text>
              <Text style={styles.value}>
                {item.warning_threshold} {item.medicine?.unit}
              </Text>
            </View>
          )}

          {item.total_value !== undefined && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tổng giá trị:</Text>
              <Text style={[styles.value, styles.priceValue]}>
                {formatCurrency(item.total_value)}
              </Text>
            </View>
          )}

          {item.last_updated && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cập nhật lần cuối:</Text>
              <Text style={styles.value}>{formatDate(item.last_updated)}</Text>
            </View>
          )}
        </View>

        {/* Batches Info Card */}
        {item.batches && item.batches.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Danh sách lô hàng ({item.batches.length})
            </Text>

            {item.batches.map((batch, idx) => (
              <View key={batch._id} style={styles.batchCard}>
                <View style={styles.batchCardHeader}>
                  <Text style={styles.batchNumber}>Lô {idx + 1}</Text>
                  <Text style={styles.batchNumberValue}>
                    {batch.batch_number}
                  </Text>
                </View>

                <View style={styles.batchDetails}>
                  <View style={styles.batchDetailRow}>
                    <Text style={styles.batchLabel}>Hạn sử dụng:</Text>
                    <Text style={styles.batchValue}>
                      {formatDate(batch.expiry_date)}
                    </Text>
                  </View>

                  <View style={styles.batchDetailRow}>
                    <Text style={styles.batchLabel}>Số lượng:</Text>
                    <Text style={styles.batchValue}>{batch.quantity}</Text>
                  </View>

                  <View style={styles.batchDetailRow}>
                    <Text style={styles.batchLabel}>Giá nhập:</Text>
                    <Text style={styles.batchValue}>
                      {formatCurrency(batch.import_price)}
                    </Text>
                  </View>

                  <View style={styles.batchDetailRow}>
                    <Text style={styles.batchLabel}>Nhà cung cấp:</Text>
                    <Text style={styles.batchValue}>
                      {batch.supplier?.name || batch.supplier_name || 'N/A'}
                    </Text>
                  </View>

                  {batch.imported_at && (
                    <View style={styles.batchDetailRow}>
                      <Text style={styles.batchLabel}>Ngày nhập:</Text>
                      <Text style={styles.batchValue}>
                        {formatDate(batch.imported_at)}
                      </Text>
                    </View>
                  )}

                  {batch.batch_value && (
                    <View style={styles.batchDetailRow}>
                      <Text style={styles.batchLabel}>Giá trị lô:</Text>
                      <Text
                        style={[styles.batchValue, styles.batchValueAmount]}
                      >
                        {formatCurrency(batch.batch_value)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
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
  headerSpacer: {
    width: 80,
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
  batchCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  batchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  batchNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  batchNumberValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2196F3',
  },
  batchDetails: {
    gap: 8,
  },
  batchDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  batchLabel: {
    fontSize: 13,
    color: '#757575',
  },
  batchValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212121',
  },
  batchValueAmount: {
    color: '#4CAF50',
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
