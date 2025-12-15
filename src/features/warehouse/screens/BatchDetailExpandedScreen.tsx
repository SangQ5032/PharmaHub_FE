// src/features/warehouse/screens/BatchDetailExpandedScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetBatchDetail } from '@features/warehouse/hooks/useBatches';

interface RouteParams {
  id?: string;
  batch?: {
    _id: string;
    [key: string]: any;
  };
}

export default function BatchDetailExpandedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  // Đọc params theo nhiều cách để đảm bảo tương thích
  const params = route.params as RouteParams | undefined;
  // Thử nhiều cách để lấy id: từ id trực tiếp, hoặc từ batch._id
  const id =
    params?.id ||
    params?.batch?._id ||
    (route.params as any)?.id ||
    (route.params as any)?.batch?._id ||
    (route.params as any)?.batchId ||
    undefined;
  const [refreshing, setRefreshing] = useState(false);

  // Chỉ gọi hook khi có id hợp lệ
  // Hook sẽ tự động không chạy nếu id là undefined hoặc empty string (enabled: !!id)
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetBatchDetail(id || '');
  const batch = response?.data;

  // Debug: Log để kiểm tra
  React.useEffect(() => {
    console.log('BatchDetailExpandedScreen: route params =', route.params);
    console.log('BatchDetailExpandedScreen: params =', params);
    console.log('BatchDetailExpandedScreen: id =', id);
    if (id) {
      console.log('BatchDetailExpandedScreen: id found =', id);
    } else {
      console.warn('BatchDetailExpandedScreen: id is missing!', {
        params,
        routeParams: route.params,
        routeName: route.name,
        routeKey: route.key,
      });
    }
  }, [id, params, route.params, route.name, route.key]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: batch?.batch_number || 'Chi tiết lô hàng',
      headerBackTitle: 'Lô hàng',
    });
  }, [navigation, batch]);

  // Kiểm tra nếu không có id
  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#F44336"
          />
          <Text style={styles.errorText}>Không tìm thấy ID lô hàng</Text>
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

  if (isLoading && !batch) {
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

  const getStatusColor = (status?: string) => {
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

  const getStatusLabel = (status?: string) => {
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

  const medicine =
    typeof batch.medicine_id === 'object' ? batch.medicine_id : batch.medicine;
  const branch =
    typeof batch.branch_id === 'object' ? batch.branch_id : batch.branch;
  const supplier =
    typeof batch.supplier_id === 'object' ? batch.supplier_id : batch.supplier;
  const statusColor = getStatusColor(batch.status);
  const statusLabel = getStatusLabel(batch.status);
  // Tính lợi nhuận dựa trên giá bán lẻ của lô hàng và giá nhập
  const retailPrice =
    batch.retail_price ||
    batch.retail_price_for_base_unit ||
    (medicine && typeof medicine === 'object' ? medicine.retail_price : 0) ||
    0;
  const profitPerUnit = retailPrice - (batch.import_price || 0);
  const soldQuantity = (batch.initial_quantity || 0) - (batch.quantity || 0);
  const soldPercent =
    batch.initial_quantity && batch.initial_quantity > 0
      ? Math.round((soldQuantity / batch.initial_quantity) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.batchIconContainer}>
              <MaterialCommunityIcons
                name="package-box"
                size={40}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.batchNumber}>{batch.batch_number}</Text>
              <Text style={styles.medicineName}>{medicine?.name}</Text>
              {medicine?.generic_name && (
                <Text style={styles.genericName}>{medicine.generic_name}</Text>
              )}
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusBadgeText}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        {/* 3 Status Cards */}
        <View style={styles.statusSection}>
          <View style={[styles.statusCardLarge, styles.statusCardGreen]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons
                name="package-multiple"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.statusCardLabel}>Tồn Kho</Text>
            </View>
            <Text style={styles.statusCardValue}>{batch.quantity}</Text>
            <Text style={styles.statusCardUnit}>{medicine?.unit}</Text>
          </View>

          <View style={[styles.statusCardLarge, styles.statusCardOrange]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons name="sale" size={24} color="#FF9800" />
              <Text style={styles.statusCardLabel}>Đã Bán</Text>
            </View>
            <Text style={styles.statusCardValue}>{soldQuantity}</Text>
            <Text style={styles.statusCardUnit}>{soldPercent}%</Text>
          </View>

          <View style={[styles.statusCardLarge, styles.statusCardBlue]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color="#2196F3"
              />
              <Text style={styles.statusCardLabel}>Lợi Nhuận/Viên</Text>
            </View>
            <Text style={styles.statusCardValue}>
              {profitPerUnit > 0 ? '+' : ''}
              {(profitPerUnit / 1000).toFixed(1)}K
            </Text>
            <Text style={styles.statusCardUnit}>đ</Text>
          </View>
        </View>

        {/* Medicine Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="pill" size={18} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Thông Tin Thuốc</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên thuốc:</Text>
            <Text style={styles.value}>{medicine?.name}</Text>
          </View>

          {medicine?.generic_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên gốc:</Text>
              <Text style={styles.value}>{medicine.generic_name}</Text>
            </View>
          )}

          {medicine?.brand_name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên thương mại:</Text>
              <Text style={styles.value}>{medicine.brand_name}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị:</Text>
            <Text style={styles.value}>{medicine?.unit}</Text>
          </View>

          {(batch.retail_price ||
            batch.retail_price_for_base_unit ||
            medicine?.retail_price) && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giá bán lẻ:</Text>
              <Text style={[styles.value, styles.priceText]}>
                ₫
                {(
                  batch.retail_price ||
                  batch.retail_price_for_base_unit ||
                  medicine?.retail_price ||
                  0
                ).toLocaleString('vi-VN')}
              </Text>
            </View>
          )}
        </View>

        {/* Batch Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="package-box"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.sectionTitle}>Thông Tin Lô Hàng</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã lô:</Text>
            <Text style={styles.value}>{batch.batch_number}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text
              style={[
                styles.value,
                styles.statusValueText,
                { color: statusColor },
              ]}
            >
              {statusLabel}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng nhập:</Text>
            <Text style={styles.value}>
              {batch.initial_quantity} {medicine?.unit}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số lượng hiện tại:</Text>
            <Text style={[styles.value, styles.currentQuantityText]}>
              {batch.quantity} {medicine?.unit}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đã bán:</Text>
            <Text style={styles.value}>
              {soldQuantity} {medicine?.unit}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${soldPercent}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{soldPercent}% đã bán</Text>
          </View>
        </View>

        {/* Price Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="currency-usd"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.sectionTitle}>Thông Tin Giá</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá nhập:</Text>
            <Text style={styles.value}>
              ₫{batch.import_price?.toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá bán lẻ:</Text>
            <Text style={[styles.value, styles.priceText]}>
              ₫
              {(
                batch.retail_price ||
                batch.retail_price_for_base_unit ||
                medicine?.retail_price ||
                0
              ).toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Lợi nhuận/viên:</Text>
            <Text style={[styles.value, styles.profitText]}>
              ₫{profitPerUnit.toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng giá nhập:</Text>
            <Text style={styles.value}>
              ₫
              {(
                (batch.import_price || 0) * (batch.initial_quantity || 0)
              ).toLocaleString('vi-VN')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng giá bán (dự tính):</Text>
            <Text style={[styles.value, styles.priceText]}>
              ₫
              {(retailPrice * (batch.initial_quantity || 0)).toLocaleString(
                'vi-VN',
              )}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tổng lợi nhuận (dự tính):</Text>
            <Text style={[styles.value, styles.profitText]}>
              ₫
              {(profitPerUnit * (batch.initial_quantity || 0)).toLocaleString(
                'vi-VN',
              )}
            </Text>
          </View>
        </View>

        {/* Expiry Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.sectionTitle}>Thông Tin Hạn Sử Dụng</Text>
          </View>

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
                !isExpired && daysToExpiry >= 30 && styles.goodText,
              ]}
            >
              {isExpired
                ? '❌ Đã hết hạn'
                : daysToExpiry < 0
                ? '❌ Quá hạn'
                : daysToExpiry < 30
                ? `⚠️ Còn ${daysToExpiry} ngày`
                : `✅ Còn ${daysToExpiry} ngày`}
            </Text>
          </View>
        </View>

        {/* Supplier Information */}
        {supplier && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="store" size={18} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Nhà Cung Cấp</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên:</Text>
              <Text style={styles.value}>{supplier.name}</Text>
            </View>

            {supplier.address && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={[styles.value, styles.addressText]}>
                  {supplier.address}
                </Text>
              </View>
            )}

            {supplier.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Điện thoại:</Text>
                <Text style={styles.value}>{supplier.phone}</Text>
              </View>
            )}
          </View>
        )}

        {/* Branch Information */}
        {branch && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="store-outline"
                size={18}
                color="#4CAF50"
              />
              <Text style={styles.sectionTitle}>Chi Nhánh</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên chi nhánh:</Text>
              <Text style={styles.value}>{branch.name}</Text>
            </View>

            {branch.address && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={[styles.value, styles.addressText]}>
                  {branch.address}
                </Text>
              </View>
            )}

            {branch.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Điện thoại:</Text>
                <Text style={styles.value}>{branch.phone}</Text>
              </View>
            )}
          </View>
        )}

        {/* Dates Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.sectionTitle}>Thông Tin Ngày Tháng</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày tạo:</Text>
            <Text style={styles.value}>
              {batch.createdAt
                ? new Date(batch.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'N/A'}
            </Text>
          </View>

          {batch.updatedAt && batch.updatedAt !== batch.createdAt && (
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

          {batch.import_record_id && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phiếu nhập:</Text>
              <Text style={[styles.value, styles.idText]}>
                {batch.import_record_id.slice(-8)}
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footerSection} />
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
  // Header
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  batchIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  batchNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 2,
  },
  genericName: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  // Status Section
  statusSection: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  statusCardLarge: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusCardGreen: {
    borderLeftColor: '#4CAF50',
  },
  statusCardOrange: {
    borderLeftColor: '#FF9800',
  },
  statusCardBlue: {
    borderLeftColor: '#2196F3',
  },
  statusCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  statusCardLabel: {
    fontSize: 10,
    color: '#757575',
    fontWeight: '500',
  },
  statusCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  statusCardUnit: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
    flex: 0.35,
  },
  value: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '600',
    flex: 0.65,
    textAlign: 'right',
  },
  priceText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  profitText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '700',
  },
  currentQuantityText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  expiredText: {
    color: '#F44336',
    fontWeight: '700',
  },
  warningText: {
    color: '#FF9800',
    fontWeight: '700',
  },
  goodText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  addressText: {
    flex: 1,
    textAlign: 'right',
  },
  statusValueText: {
    fontWeight: '700',
  },
  idText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontFamily: 'monospace',
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
    backgroundColor: '#FF9800',
  },
  progressText: {
    fontSize: 11,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  footerSection: {
    paddingVertical: 16,
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
    fontSize: 13,
  },
});
