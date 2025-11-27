// src/features/warehouse/screens/InventoryDetailExpandedScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetInventoryByBranchAndMedicine } from '@features/warehouse/hooks/useInventory';
import { useGetBatchesByMedicine } from '@features/warehouse/hooks/useBatches';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { BatchCard } from '@features/warehouse/components/BatchCard';
import { ROUTES } from '@shared/constants/routes';

interface RouteParams {
  medicineId: string;
  branchId?: string;
}

export default function InventoryDetailExpandedScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { medicineId, branchId: routeBranchId } = route.params as RouteParams;
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore(state => state.user);
  const branchId = routeBranchId || user?.branch_id || '';

  // Fetch inventory detail for this medicine at this branch
  const inventoryQuery = useGetInventoryByBranchAndMedicine(
    branchId,
    medicineId,
  );
  const inventory = inventoryQuery.data?.data;

  // Fetch batches for this medicine at this branch
  const batchesQuery = useGetBatchesByMedicine(branchId, medicineId);
  const batches = (batchesQuery.data?.data as any[]) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([inventoryQuery.refetch(), batchesQuery.refetch()]);
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: inventory?.medicine?.name || 'Chi tiết thuốc',
      headerBackTitle: 'Quay lại',
    });
  }, [navigation, inventory]);

  if (inventoryQuery.isLoading && !inventory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (!inventory) {
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

  const medicine = inventory.medicine;
  const branch = inventory.branch;

  // Group batches by status
  const groupedBatches = batches.reduce(
    (acc: Record<string, any[]>, batch: any) => {
      const status = batch.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(batch);
      return acc;
    },
    {},
  );

  const batchSections: { title: string; data: any[] }[] = Object.entries(
    groupedBatches,
  ).map(([status, items]: [string, any]) => ({
    title: `${status.toUpperCase()} (${items.length})`,
    data: items,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sufficient':
      case 'normal':
        return '#4CAF50';
      case 'low_stock':
      case 'low':
        return '#FF9800';
      case 'out_of_stock':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sufficient':
      case 'normal':
        return 'Đủ hàng';
      case 'low_stock':
      case 'low':
        return 'Sắp hết';
      case 'out_of_stock':
        return 'Hết hàng';
      default:
        return 'Không xác định';
    }
  };

  const statusColor = getStatusColor(inventory.status || 'normal');
  const statusText = getStatusText(inventory.status || 'normal');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Medicine Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.medicineIconContainer}>
              <MaterialCommunityIcons name="pill" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.medicineName}>{medicine?.name}</Text>
              {medicine?.generic_name && (
                <Text style={styles.genericName}>{medicine.generic_name}</Text>
              )}
              {medicine?.brand_name && (
                <Text style={styles.brandName}>{medicine.brand_name}</Text>
              )}
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <Text style={styles.statusBadgeText}>{statusText}</Text>
            </View>
          </View>
        </View>

        {/* Inventory Status - 3 Cards */}
        <View style={styles.statusSection}>
          <View style={[styles.statusCardLarge, styles.statusCardGreen]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons
                name="package-multiple"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.statusCardLabel}>Tồn Kho Hiện Tại</Text>
            </View>
            <Text style={styles.statusCardValue}>
              {inventory.total_quantity}
            </Text>
            <Text style={styles.statusCardUnit}>{medicine?.unit}</Text>
          </View>

          <View style={[styles.statusCardLarge, styles.statusCardOrange]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons name="alert" size={24} color="#FF9800" />
              <Text style={styles.statusCardLabel}>Mức Cảnh Báo</Text>
            </View>
            <Text style={styles.statusCardValue}>
              {inventory.warning_threshold}
            </Text>
            <Text style={styles.statusCardUnit}>{medicine?.unit}</Text>
          </View>

          <View style={[styles.statusCardLarge, styles.statusCardBlue]}>
            <View style={styles.statusCardTop}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color="#2196F3"
              />
              <Text style={styles.statusCardLabel}>Giá Trị Kho</Text>
            </View>
            <Text style={styles.statusCardValue}>
              {(inventory.total_value || 0 / 1000000).toFixed(1)}M
            </Text>
            <Text style={styles.statusCardUnit}>đ</Text>
          </View>
        </View>

        {/* Branch Information */}
        {branch && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="store" size={18} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Thông Tin Chi Nhánh</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tên:</Text>
              <Text style={styles.value}>{branch.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ:</Text>
              <Text style={[styles.value, styles.addressText]}>
                {branch?.address}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Điện thoại:</Text>
              <Text style={styles.value}>{branch?.phone || 'N/A'}</Text>
            </View>
          </View>
        )}

        {/* Medicine Details - Basic Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.sectionTitle}>Thông Tin Cơ Bản</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên gốc:</Text>
            <Text style={styles.value}>{medicine?.generic_name || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Tên thương mại:</Text>
            <Text style={styles.value}>{medicine?.brand_name || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị:</Text>
            <Text style={styles.value}>{medicine?.unit}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Dạng bào chế:</Text>
            <Text style={styles.value}>{medicine?.dosage_form || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Hàm lượng:</Text>
            <Text style={styles.value}>{medicine?.strength || 'N/A'}</Text>
          </View>
        </View>

        {/* Medicine Details - Price & Manufacturer */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="factory" size={18} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Giá & Nhà Sản Xuất</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Giá bán lẻ:</Text>
            <Text style={[styles.value, styles.priceText]}>
              ₫{medicine?.retail_price?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nhà sản xuất:</Text>
            <Text style={styles.value}>{medicine?.manufacturer || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Xuất xứ:</Text>
            <Text style={styles.value}>
              {medicine?.country_of_origin || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Số đăng ký:</Text>
            <Text style={styles.value}>
              {medicine?.registration_number || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Mã vạch:</Text>
            <Text style={styles.value}>{medicine?.barcode || 'N/A'}</Text>
          </View>
        </View>

        {/* Medicine Details - Clinical */}
        {(medicine?.indications ||
          medicine?.contraindications ||
          medicine?.side_effects ||
          medicine?.usage_instructions) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="medical-bag"
                size={18}
                color="#4CAF50"
              />
              <Text style={styles.sectionTitle}>Thông Tin Y Tế</Text>
            </View>

            {medicine?.indications && (
              <View style={styles.textBlockRow}>
                <Text style={styles.label}>Chỉ định:</Text>
                <Text style={styles.textBlockValue}>
                  {medicine.indications}
                </Text>
              </View>
            )}

            {medicine?.contraindications && (
              <View style={styles.textBlockRow}>
                <Text style={styles.label}>Chống chỉ định:</Text>
                <Text style={styles.textBlockValue}>
                  {medicine.contraindications}
                </Text>
              </View>
            )}

            {medicine?.side_effects && (
              <View style={styles.textBlockRow}>
                <Text style={styles.label}>Tác dụng phụ:</Text>
                <Text style={styles.textBlockValue}>
                  {medicine.side_effects}
                </Text>
              </View>
            )}

            {medicine?.usage_instructions && (
              <View style={styles.textBlockRow}>
                <Text style={styles.label}>Cách dùng:</Text>
                <Text style={styles.textBlockValue}>
                  {medicine.usage_instructions}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Storage Information */}
        {medicine?.storage_conditions && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="snowflake"
                size={18}
                color="#4CAF50"
              />
              <Text style={styles.sectionTitle}>Điều Kiện Bảo Quản</Text>
            </View>

            <View style={styles.textBlockRow}>
              <Text style={[styles.value, styles.textBlockStyled]}>
                {medicine.storage_conditions}
              </Text>
            </View>
          </View>
        )}

        {/* Batches Section */}
        {batches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="package-box"
                size={18}
                color="#4CAF50"
              />
              <Text style={styles.sectionTitle}>
                Lô Hàng ({batches.length})
              </Text>
            </View>

            <SectionList
              sections={batchSections}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(ROUTES.BATCH_DETAIL, {
                      id: item._id,
                    });
                  }}
                >
                  <BatchCard batch={item} onPress={() => {}} />
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.batchSectionHeader}>
                  <Text style={styles.batchSectionTitle}>{title}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Last Updated */}
        <View style={styles.footerSection}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color="#9E9E9E"
          />
          <Text style={styles.footerText}>
            {inventory.last_updated
              ? new Date(inventory.last_updated).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Chưa cập nhật'}
          </Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header Card
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
  medicineIconContainer: {
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
  medicineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  genericName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  brandName: {
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
  statusCardGreen: {
    borderLeftColor: '#4CAF50',
  },
  statusCardOrange: {
    borderLeftColor: '#FF9800',
  },
  statusCardBlue: {
    borderLeftColor: '#2196F3',
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
  textBlockRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textBlockValue: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 18,
    marginTop: 6,
  },
  textBlockStyled: {
    fontSize: 13,
  },
  addressText: {
    flex: 1,
    textAlign: 'right',
  },
  batchSectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  batchSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#9E9E9E',
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
