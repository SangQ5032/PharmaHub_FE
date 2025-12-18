import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';
import { useAuth } from '@app/providers/AuthProvider';
import { Medicine } from '../types';
import { useMedicineDetail } from '../hooks/useMedicineDetail';
import { useMedicineInventory } from '../hooks/useMedicineInventory';
import InventoryBranchCard from '../components/InventoryBranchCard';

const Row: React.FC<{
  label: string;
  value?: string | number | null | boolean | any;
}> = ({ label, value }) => {
  let displayValue: string;
  if (value == null || value === '') {
    displayValue = '-';
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Có' : 'Không';
  } else if (typeof value === 'object') {
    // Nếu value là object, không render trực tiếp
    displayValue = JSON.stringify(value);
  } else {
    displayValue = String(value);
  }

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{displayValue}</Text>
    </View>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const formatDate = (d?: string) => {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatPrice = (p?: number | null) => {
  if (p == null) return '-';
  return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const MedicineDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<MainStackParamList, typeof ROUTES.MEDICINE_DETAIL>>();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);

  // Get item from route params (fallback for offline viewing)
  const itemFromParams: Medicine | any = (route.params as any)?.item ?? {};
  const medicineId = itemFromParams?._id;

  // Use hook to fetch fresh data from API
  const { medicine, loading, error, refresh } = useMedicineDetail(medicineId);

  // Use medicine from API if available, otherwise use params data
  // Ensure item is always an object to prevent undefined errors
  const item = medicine || itemFromParams || {};

  // Reset image error when item changes
  useEffect(() => {
    setImageError(false);
  }, [item?.image_url]);

  // Inventory hook
  const {
    inventory,
    loading: inventoryLoading,
    error: inventoryError,
    sortBy,
    setSortBy,
    refresh: refreshInventory,
  } = useMedicineInventory(medicineId || '');

  const [activeTab, setActiveTab] = useState<'info' | 'inventory'>('info');

  // Tính toán: tách chi nhánh của user hiện tại ra khỏi danh sách
  const { currentBranchInventory, otherBranches } = useMemo(() => {
    if (!inventory?.branches || !user?.branch_id) {
      return {
        currentBranchInventory: null,
        otherBranches: inventory?.branches || [],
      };
    }

    const current = inventory.branches.find(
      b => b.branch_id === user.branch_id,
    );
    const others = inventory.branches.filter(
      b => b.branch_id !== user.branch_id,
    );

    return { currentBranchInventory: current || null, otherBranches: others };
  }, [inventory?.branches, user?.branch_id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết thuốc</Text>
      </View>

      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'info' && styles.tabBtnActive]}
          onPress={() => setActiveTab('info')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'info' && styles.tabTextActive,
            ]}
          >
            Thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabBtn,
            activeTab === 'inventory' && styles.tabBtnActive,
          ]}
          onPress={() => setActiveTab('inventory')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'inventory' && styles.tabTextActive,
            ]}
          >
            Tồn kho
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              {/* Thông tin cơ bản */}
              <View style={styles.card}>
                <SectionTitle title="Thông tin cơ bản" />
                <View style={styles.imageContainer}>
                  {item?.image_url && !imageError ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.medicineImage}
                      resizeMode="cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Image
                      source={require('@shared/assets/columbina.png')}
                      style={styles.medicineImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Row label="Tên thuốc" value={item?.name} />
                {item.description && (
                  <View style={styles.textRow}>
                    <Text style={styles.textLabel}>Mô tả:</Text>
                    <Text style={styles.textValue}>{item.description}</Text>
                  </View>
                )}
                <Row
                  label="Đơn vị cơ sở"
                  value={(() => {
                    if (!item.base_unit) return '-';
                    if (
                      typeof item.base_unit === 'object' &&
                      item.base_unit !== null
                    ) {
                      const name =
                        item.base_unit.name &&
                        typeof item.base_unit.name === 'string'
                          ? item.base_unit.name
                          : '-';
                      const shortName =
                        item.base_unit.short_name &&
                        typeof item.base_unit.short_name === 'string'
                          ? item.base_unit.short_name
                          : '-';
                      const ratio =
                        typeof item.base_unit.ratio_to_base === 'number'
                          ? item.base_unit.ratio_to_base
                          : 1;
                      return `${name} (${shortName}) - Tỷ lệ: ${ratio}`;
                    }
                    if (typeof item.base_unit === 'string') {
                      return item.base_unit;
                    }
                    return '-';
                  })()}
                />
                {item.units &&
                  Array.isArray(item.units) &&
                  item.units.length > 0 && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Các đơn vị khác:</Text>
                      <View style={styles.unitsList}>
                        {item.units
                          .filter(
                            (u: any) =>
                              u && typeof u === 'object' && u !== null,
                          )
                          .map((u: any, index: number) => {
                            const name =
                              u.name && typeof u.name === 'string'
                                ? String(u.name)
                                : '-';
                            const shortName =
                              u.short_name && typeof u.short_name === 'string'
                                ? String(u.short_name)
                                : '-';
                            const ratio =
                              typeof u.ratio_to_base === 'number'
                                ? String(u.ratio_to_base)
                                : '1';
                            return (
                              <View
                                key={u._id || index}
                                style={styles.unitItem}
                              >
                                <Text style={styles.unitText}>
                                  • {name} ({shortName}) - Tỷ lệ: {ratio}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    </View>
                  )}
                {item.unit_ratios &&
                  typeof item.unit_ratios === 'object' &&
                  Object.keys(item.unit_ratios).length > 0 && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Bảng tỷ lệ đơn vị:</Text>
                      <View style={styles.unitsList}>
                        {Object.entries(item.unit_ratios).map(
                          ([unitId, ratio], index) => {
                            if (!unitId || typeof unitId !== 'string')
                              return null;
                            const unit = item.units?.find(
                              (u: any) => u?._id === unitId,
                            );
                            let unitName: string;
                            if (
                              unit &&
                              typeof unit === 'object' &&
                              unit !== null
                            ) {
                              unitName =
                                unit.name && typeof unit.name === 'string'
                                  ? unit.name
                                  : unit.short_name &&
                                    typeof unit.short_name === 'string'
                                  ? unit.short_name
                                  : String(unitId);
                            } else {
                              unitName = String(unitId);
                            }
                            const ratioStr =
                              typeof ratio === 'number'
                                ? String(ratio)
                                : String(ratio || '0');
                            return (
                              <View
                                key={unitId || index}
                                style={styles.unitItem}
                              >
                                <Text style={styles.unitText}>
                                  • {unitName}: {ratioStr} (so với đơn vị cơ sở)
                                </Text>
                              </View>
                            );
                          },
                        )}
                      </View>
                    </View>
                  )}
                <Row label="Nhà sản xuất" value={item?.manufacturer} />
                <Row
                  label="Trạng thái"
                  value={
                    item?.is_active !== false ? 'Hoạt động' : 'Vô hiệu hóa'
                  }
                />
                {/* Legacy fields - chỉ hiển thị nếu có */}
                {item.generic_name && (
                  <Row label="Hoạt chất" value={item.generic_name} />
                )}
                {item.brand_name && (
                  <Row label="Tên thương mại" value={item.brand_name} />
                )}
                {item.dosage_form && (
                  <Row label="Dạng liều" value={item.dosage_form} />
                )}
                {item.strength && (
                  <Row label="Hàm lượng" value={item.strength} />
                )}
              </View>

              {/* Giá cả */}
              <View style={styles.card}>
                <SectionTitle title="Giá cả" />
                {item.default_retail_price != null && (
                  <Row
                    label="Giá bán lẻ mặc định"
                    value={`${formatPrice(item.default_retail_price)} đ`}
                  />
                )}
                {item.default_import_price != null && (
                  <Row
                    label="Giá nhập mặc định"
                    value={`${formatPrice(item.default_import_price)} đ`}
                  />
                )}
                {item.default_expiry_duration_days != null && (
                  <Row
                    label="Thời hạn sử dụng mặc định"
                    value={`${
                      item.default_expiry_duration_days
                    } ngày (${Math.round(
                      item.default_expiry_duration_days / 30,
                    )} tháng)`}
                  />
                )}
                {!item.default_expiry_duration_days &&
                  item.default_expiry_duration_months != null && (
                    <Row
                      label="Thời hạn sử dụng mặc định"
                      value={`${item.default_expiry_duration_months} tháng`}
                    />
                  )}
                {/* Legacy support - chỉ hiển thị nếu không có giá mới */}
                {!item.default_retail_price &&
                  !item.default_import_price &&
                  item.prices && (
                    <>
                      {item.prices.base_unit_price > 0 && (
                        <Row
                          label={`Giá đơn vị cơ sở (${
                            typeof item.base_unit === 'object' &&
                            item.base_unit !== null
                              ? item.base_unit.name &&
                                typeof item.base_unit.name === 'string'
                                ? item.base_unit.name
                                : item.base_unit.short_name &&
                                  typeof item.base_unit.short_name === 'string'
                                ? item.base_unit.short_name
                                : 'tablet'
                              : typeof item.base_unit === 'string'
                              ? item.base_unit
                              : 'tablet'
                          })`}
                          value={`${formatPrice(
                            item.prices.base_unit_price,
                          )} đ`}
                        />
                      )}
                    </>
                  )}
              </View>

              {/* Thông tin dược phẩm */}
              {item.pharmaceutical_info && (
                <View style={styles.card}>
                  <SectionTitle title="Thông tin dược phẩm" />
                  {item.pharmaceutical_info.active_ingredient && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Hoạt chất:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.active_ingredient}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.indication && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Chỉ định:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.indication}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.usage && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Công dụng:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.usage}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.contraindication && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Chống chỉ định:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.contraindication}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.dosage && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Liều dùng:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.dosage}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.administration && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Cách dùng:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.administration}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.side_effects && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Tác dụng phụ:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.side_effects}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.drug_interactions && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Tương tác thuốc:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.drug_interactions}
                      </Text>
                    </View>
                  )}
                  {item.pharmaceutical_info.other_info && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Thông tin khác:</Text>
                      <Text style={styles.textValue}>
                        {item.pharmaceutical_info.other_info}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Thông tin sản xuất (legacy support) */}
              {(item.country_of_origin ||
                item.registration_number ||
                item.barcode ||
                item.manufacturing_date) && (
                <View style={styles.card}>
                  <SectionTitle title="Thông tin sản xuất" />
                  {item.manufacturing_date && (
                    <Row
                      label="Hạn sản xuất"
                      value={formatDate(item.manufacturing_date)}
                    />
                  )}
                  {item.country_of_origin && (
                    <Row label="Nước sản xuất" value={item.country_of_origin} />
                  )}
                  {item.registration_number && (
                    <Row label="Số đăng ký" value={item.registration_number} />
                  )}
                  {item.barcode && <Row label="Mã vạch" value={item.barcode} />}
                </View>
              )}

              {/* Chỉ định & Chống chỉ định (legacy support) */}
              {(item.indications ||
                item.contraindications ||
                item.side_effects) && (
                <View style={styles.card}>
                  <SectionTitle title="Chỉ định & Chống chỉ định" />
                  {item.indications && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Chỉ định:</Text>
                      <Text style={styles.textValue}>{item.indications}</Text>
                    </View>
                  )}
                  {item.contraindications && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Chống chỉ định:</Text>
                      <Text style={styles.textValue}>
                        {item.contraindications}
                      </Text>
                    </View>
                  )}
                  {item.side_effects && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Tác dụng phụ:</Text>
                      <Text style={styles.textValue}>{item.side_effects}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Hướng dẫn sử dụng & Bảo quản (legacy support) */}
              {(item.usage_instructions ||
                item.storage_conditions ||
                item.alert_threshold) && (
                <View style={styles.card}>
                  <SectionTitle title="Hướng dẫn sử dụng & Bảo quản" />
                  {item.usage_instructions && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Cách dùng:</Text>
                      <Text style={styles.textValue}>
                        {item.usage_instructions}
                      </Text>
                    </View>
                  )}
                  {item.storage_conditions && (
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Bảo quản:</Text>
                      <Text style={styles.textValue}>
                        {item.storage_conditions}
                      </Text>
                    </View>
                  )}
                  {item.alert_threshold != null && (
                    <Row label="Ngưỡng cảnh báo" value={item.alert_threshold} />
                  )}
                </View>
              )}

              {/* Thông tin hệ thống */}
              <View style={styles.card}>
                <SectionTitle title="Thông tin hệ thống" />
                <Row label="ID" value={item?._id} />
                <Row label="Tạo lúc" value={formatDate(item?.createdAt)} />
                <Row label="Cập nhật" value={formatDate(item?.updatedAt)} />
              </View>
            </ScrollView>
          )}
        </>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <>
          {inventoryError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{inventoryError}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={refreshInventory}
              >
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}

          {inventoryLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Đang tải dữ liệu tồn kho...
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              {inventory && (
                <>
                  {/* Summary Card */}
                  <View style={styles.card}>
                    <SectionTitle title="Tổng quan tồn kho" />
                    <Row
                      label="Tổng số lượng"
                      value={inventory.total_quantity}
                    />
                    <Row
                      label="Ngưỡng cảnh báo"
                      value={inventory.alert_threshold}
                    />
                    <Row label="Đơn vị" value={inventory.unit} />
                    <Row
                      label="Giá bán lẻ"
                      value={formatPrice(inventory.retail_price)}
                    />
                  </View>

                  {/* Sort Controls */}
                  <View style={styles.sortContainer}>
                    <Text style={styles.sortLabel}>Sắp xếp theo:</Text>
                    <View style={styles.sortButtons}>
                      <TouchableOpacity
                        style={[
                          styles.sortBtn,
                          sortBy === 'branch_name' && styles.sortBtnActive,
                        ]}
                        onPress={() => setSortBy('branch_name')}
                      >
                        <Text
                          style={[
                            styles.sortBtnText,
                            sortBy === 'branch_name' &&
                              styles.sortBtnTextActive,
                          ]}
                        >
                          Chi nhánh
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.sortBtn,
                          sortBy === 'total_quantity' && styles.sortBtnActive,
                        ]}
                        onPress={() => setSortBy('total_quantity')}
                      >
                        <Text
                          style={[
                            styles.sortBtnText,
                            sortBy === 'total_quantity' &&
                              styles.sortBtnTextActive,
                          ]}
                        >
                          Số lượng (↓)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.sortBtn,
                          sortBy === 'low_quantity' && styles.sortBtnActive,
                        ]}
                        onPress={() => setSortBy('low_quantity')}
                      >
                        <Text
                          style={[
                            styles.sortBtnText,
                            sortBy === 'low_quantity' &&
                              styles.sortBtnTextActive,
                          ]}
                        >
                          Số lượng (↑)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Branches List */}
                  {inventory.branches && inventory.branches.length > 0 ? (
                    <View>
                      {/* Current Branch - "Chi nhánh của tôi" */}
                      {currentBranchInventory && (
                        <View style={styles.currentBranchSection}>
                          <Text style={styles.currentBranchTitle}>
                            Chi nhánh của tôi
                          </Text>
                          <InventoryBranchCard
                            branch={currentBranchInventory}
                          />
                        </View>
                      )}

                      {/* Other Branches */}
                      {otherBranches.length > 0 && (
                        <View>
                          <Text style={styles.branchesTitle}>
                            Chi nhánh khác ({otherBranches.length})
                          </Text>
                          <FlatList
                            data={otherBranches}
                            keyExtractor={branchItem => branchItem.branch_id}
                            renderItem={({ item: branchItem }) => (
                              <InventoryBranchCard branch={branchItem} />
                            )}
                            scrollEnabled={false}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.emptyInventory}>
                      <Text style={styles.emptyText}>
                        Không có dữ liệu tồn kho
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  backBtn: { position: 'absolute', left: 12, top: 18 },
  backText: { color: '#fff', fontWeight: '600' },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#2EB872',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#2EB872',
  },

  content: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2EB872',
    marginBottom: 12,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  label: { color: '#333', fontWeight: '600', marginRight: 8, flex: 1 },
  value: { color: '#555', flex: 1.5, textAlign: 'right' },
  textRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  textLabel: { color: '#333', fontWeight: '600', marginBottom: 6 },
  textValue: { color: '#555', lineHeight: 20 },
  unitsList: {
    marginTop: 4,
  },
  unitItem: {
    marginBottom: 4,
  },
  unitText: {
    color: '#555',
    lineHeight: 20,
    fontSize: 14,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  medicineImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    margin: 12,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 8,
  },
  retryBtn: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },

  // Inventory styles
  sortContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2EB872',
    backgroundColor: '#fff',
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
  },
  sortBtnActive: {
    backgroundColor: '#2EB872',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2EB872',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  branchesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2EB872',
    marginBottom: 12,
    marginTop: 8,
  },
  currentBranchSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  currentBranchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2EB872',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  emptyInventory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default MedicineDetailScreen;
