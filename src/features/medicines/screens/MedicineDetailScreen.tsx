import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';
import { Medicine } from '../types';
import { useMedicineDetail } from '../hooks/useMedicineDetail';
import { useMedicineInventory } from '../hooks/useMedicineInventory';
import InventoryBranchCard from '../components/InventoryBranchCard';

const Row: React.FC<{
  label: string;
  value?: string | number | null | boolean;
}> = ({ label, value }) => {
  let displayValue: string;
  if (value == null || value === '') {
    displayValue = '-';
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Có' : 'Không';
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

  // Get item from route params (fallback for offline viewing)
  const itemFromParams: Medicine | any = (route.params as any)?.item ?? {};
  const medicineId = itemFromParams._id;

  // Use hook to fetch fresh data from API
  const { medicine, loading, error, refresh } = useMedicineDetail(medicineId);

  // Use medicine from API if available, otherwise use params data
  const item = medicine || itemFromParams;

  // Inventory hook
  const {
    inventory,
    loading: inventoryLoading,
    error: inventoryError,
    sortBy,
    setSortBy,
    refresh: refreshInventory,
  } = useMedicineInventory(medicineId);

  const [activeTab, setActiveTab] = useState<'info' | 'inventory'>('info');

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
                <Row label="Tên thuốc" value={item.name} />
                <Row label="Hoạt chất" value={item.generic_name} />
                <Row label="Tên thương mại" value={item.brand_name} />
                <Row label="Dạng liều" value={item.dosage_form} />
                <Row label="Hàm lượng" value={item.strength} />
                <Row label="Đơn vị" value={item.unit} />
                <Row label="Đóng gói" value={item.packaging} />
              </View>

              {/* Phân loại */}
              <View style={styles.card}>
                <SectionTitle title="Phân loại" />
                <Row label="Nhóm thuốc" value={item.category_id?.name} />
                <Row label="Yêu cầu đơn" value={item.prescription_required} />
                <Row label="Thuốc kiểm soát" value={item.is_controlled} />
                <Row
                  label="Trạng thái"
                  value={item.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
                />
              </View>

              {/* Giá cả */}
              <View style={styles.card}>
                <SectionTitle title="Giá cả" />
                <Row
                  label="Giá bán lẻ"
                  value={formatPrice(item.retail_price)}
                />
                <Row
                  label="Giá tối thiểu"
                  value={formatPrice(item.minimum_price)}
                />
                <Row label="Giá tối đa" value={formatPrice(item.max_price)} />
              </View>

              {/* Thông tin sản xuất */}
              <View style={styles.card}>
                <SectionTitle title="Thông tin sản xuất" />
                <Row label="Nhà sản xuất" value={item.manufacturer} />
                <Row label="Nước sản xuất" value={item.country_of_origin} />
                <Row label="Số đăng ký" value={item.registration_number} />
                <Row label="Mã vạch" value={item.barcode} />
              </View>

              {/* Chỉ định & Chống chỉ định */}
              <View style={styles.card}>
                <SectionTitle title="Chỉ định & Chống chỉ định" />
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Chỉ định:</Text>
                  <Text style={styles.textValue}>
                    {item.indications || '-'}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Chống chỉ định:</Text>
                  <Text style={styles.textValue}>
                    {item.contraindications || '-'}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Tác dụng phụ:</Text>
                  <Text style={styles.textValue}>
                    {item.side_effects || '-'}
                  </Text>
                </View>
              </View>

              {/* Hướng dẫn sử dụng & Bảo quản */}
              <View style={styles.card}>
                <SectionTitle title="Hướng dẫn sử dụng & Bảo quản" />
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Cách dùng:</Text>
                  <Text style={styles.textValue}>
                    {item.usage_instructions || '-'}
                  </Text>
                </View>
                <View style={styles.textRow}>
                  <Text style={styles.textLabel}>Bảo quản:</Text>
                  <Text style={styles.textValue}>
                    {item.storage_conditions || '-'}
                  </Text>
                </View>
                <Row label="Ngưỡng cảnh báo" value={item.alert_threshold} />
              </View>

              {/* Thông tin hệ thống */}
              <View style={styles.card}>
                <SectionTitle title="Thông tin hệ thống" />
                <Row label="ID" value={item._id} />
                <Row label="Tạo lúc" value={formatDate(item.createdAt)} />
                <Row label="Cập nhật" value={formatDate(item.updatedAt)} />
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
                      <Text style={styles.branchesTitle}>
                        Chi nhánh ({inventory.branches.length})
                      </Text>
                      <FlatList
                        data={inventory.branches}
                        keyExtractor={item => item.branch_id}
                        renderItem={({ item: branch }) => (
                          <InventoryBranchCard branch={branch} />
                        )}
                        scrollEnabled={false}
                      />
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
