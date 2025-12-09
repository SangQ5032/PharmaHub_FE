// src/features/warehouse/screens/InventoryDetailWithBatchesScreen.tsx

import React, { useMemo } from 'react';
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
import { useMedicineDetail } from '@features/medicines/hooks/useMedicineDetail';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { BatchCard } from '@features/warehouse/components/BatchCard';
import { ROUTES } from '@shared/constants/routes';
import {
  calculateQuantitiesByUnit,
  getSortedUnits,
  getUnitDisplayName,
} from '../../../utils/medicineUnits';

interface RouteParams {
  medicineId: string;
  branchId?: string;
}

export default function InventoryDetailWithBatchesScreen() {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { medicineId, branchId: routeBranchId } = route.params as RouteParams;

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

  // Fetch thông tin thuốc chi tiết từ API riêng
  const {
    medicine: medicineDetail,
    loading: medicineLoading,
    error: medicineError,
    refresh: refreshMedicine,
  } = useMedicineDetail(medicineId);

  // Sử dụng thông tin thuốc từ API riêng, fallback về inventory.medicine nếu chưa load xong
  const medicine = medicineDetail || inventory?.medicine;

  // Tính toán số lượng tồn kho theo các đơn vị từ package_structure
  const quantitiesByUnit = useMemo(() => {
    if (!medicine || !inventory?.total_quantity_in_base_unit) {
      return {};
    }
    return calculateQuantitiesByUnit(
      medicine,
      inventory.total_quantity_in_base_unit || inventory.total_quantity || 0,
    );
  }, [
    medicine,
    inventory?.total_quantity_in_base_unit,
    inventory?.total_quantity,
  ]);

  // Lấy danh sách đơn vị đã sắp xếp
  const sortedUnits = useMemo(() => {
    if (!medicine) return [];
    return getSortedUnits(medicine);
  }, [medicine]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: medicine?.name || 'Chi tiết thuốc',
      headerBackTitle: 'Quay lại',
    });
  }, [navigation, medicine]);

  if (inventoryQuery.isLoading || medicineLoading) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Medicine Header */}
        <View style={styles.headerSection}>
          <View style={styles.medicineHeader}>
            <MaterialCommunityIcons
              name="pill"
              size={32}
              color="#4CAF50"
              style={styles.medicineIcon}
            />
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{medicine?.name}</Text>
              {medicine?.description && (
                <Text style={styles.description}>{medicine.description}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Inventory Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tồn Kho</Text>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Số lượng</Text>
              <Text style={styles.statusValue}>
                {inventory.total_quantity_in_base_unit ||
                  inventory.quantity ||
                  0}
              </Text>
              <Text style={styles.statusUnit}>
                {medicine?.base_unit || medicine?.unit || ''}
              </Text>
            </View>

            {/* Multi-Unit Display - Tính toán động từ package_structure */}
            {sortedUnits.length > 1 &&
              sortedUnits
                .filter(unit => {
                  const quantity = quantitiesByUnit[unit];
                  return (
                    quantity !== undefined && quantity !== null && quantity > 0
                  );
                })
                .slice(0, 3)
                .map(unit => {
                  const quantity = quantitiesByUnit[unit];
                  return (
                    <View key={unit} style={styles.statusCard}>
                      <Text style={styles.statusLabel}>
                        {getUnitDisplayName(unit)}
                      </Text>
                      <Text style={styles.statusValue}>{quantity}</Text>
                      <Text style={styles.statusUnit}>
                        {getUnitDisplayName(unit).toLowerCase()}
                      </Text>
                    </View>
                  );
                })}

            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Cảnh báo</Text>
              <Text style={styles.statusValue}>
                {medicine?.warning_threshold ||
                  inventory?.warning_threshold ||
                  '0'}
              </Text>
              <Text style={styles.statusUnit}>{medicine?.unit || ''}</Text>
            </View>

            <View style={[styles.statusCard, styles.statusCardGray]}>
              <Text style={styles.statusLabel}>Trạng thái</Text>
              <Text
                style={[
                  styles.statusValue,
                  inventory.status === 'low' && styles.warningStatus,
                  inventory.status === 'out_of_stock' && styles.errorStatus,
                ]}
              >
                {inventory.status === 'normal'
                  ? 'Đủ'
                  : inventory.status === 'low'
                  ? 'Sắp hết'
                  : 'Hết hàng'}
              </Text>
            </View>
          </View>
        </View>

        {/* Medicine Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Thuốc</Text>

          {medicine?.category_id && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Danh mục:</Text>
              <Text style={styles.value}>
                {typeof medicine.category_id === 'object'
                  ? medicine.category_id.name
                  : medicine.category_id || 'N/A'}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Đơn vị cơ bản:</Text>
            <Text style={styles.value}>
              {medicine?.base_unit || medicine?.unit || 'N/A'}
            </Text>
          </View>

          {medicine?.packaging && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Quy cách đóng gói:</Text>
              <Text style={styles.value}>{medicine.packaging}</Text>
            </View>
          )}

          {medicine?.dosage_form && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dạng bào chế:</Text>
              <Text style={styles.value}>{medicine.dosage_form}</Text>
            </View>
          )}

          {medicine?.strength && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Hàm lượng:</Text>
              <Text style={styles.value}>{medicine.strength}</Text>
            </View>
          )}

          {medicine?.description && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mô tả:</Text>
              <Text style={styles.value}>{medicine.description}</Text>
            </View>
          )}
        </View>

        {/* Price Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giá</Text>

          {medicine?.prices && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giá bán:</Text>
              <View style={styles.priceContainer}>
                {medicine.prices.price_per_unit &&
                  Object.entries(medicine.prices.price_per_unit).map(
                    ([unit, price]) => (
                      <Text
                        key={unit}
                        style={[
                          styles.value,
                          styles.priceValue,
                          styles.priceItem,
                        ]}
                      >
                        ₫{Number(price).toLocaleString('vi-VN')}/
                        {getUnitDisplayName(unit)}
                      </Text>
                    ),
                  )}
                {!medicine.prices.price_per_unit &&
                  medicine.prices.base_unit_price && (
                    <Text style={[styles.value, styles.priceValue]}>
                      ₫{medicine.prices.base_unit_price.toLocaleString('vi-VN')}
                      /{getUnitDisplayName(medicine.base_unit || '')}
                    </Text>
                  )}
              </View>
            </View>
          )}

          {!medicine?.prices && medicine?.retail_price && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giá bán lẻ:</Text>
              <Text style={[styles.value, styles.priceValue]}>
                ₫{medicine.retail_price.toLocaleString('vi-VN')}
              </Text>
            </View>
          )}

          {!medicine?.prices && !medicine?.retail_price && medicine?.price && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Giá:</Text>
              <Text style={[styles.value, styles.priceValue]}>
                ₫{medicine.price.toLocaleString('vi-VN')}
              </Text>
            </View>
          )}
        </View>

        {/* Batches Section */}
        {batches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lô Hàng ({batches.length})</Text>

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
          <Text style={styles.footerText}>
            Cập nhật lần cuối:{' '}
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
  headerSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  medicineIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#757575',
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
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  statusCardGray: {
    backgroundColor: '#F5F5F5',
  },
  statusLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 6,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  statusUnit: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  warningStatus: {
    color: '#FF9800',
  },
  errorStatus: {
    color: '#F44336',
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
    flex: 0.4,
  },
  value: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '600',
    flex: 0.6,
    textAlign: 'right',
  },
  priceValue: {
    color: '#4CAF50',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  priceItem: {
    fontSize: 13,
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
    padding: 16,
    alignItems: 'center',
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
  },
});
