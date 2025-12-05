// src/features/warehouse/screens/InventoryListScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetAllBatches } from '@features/warehouse/hooks/useInventory';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { Batch } from '@features/warehouse/types/inventory.types';
import { ROUTES } from '@shared/constants/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InventoryListScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  // State
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  // Get branchId từ user hoặc params
  const branchId = route?.params?.branchId ?? user?.branch_id ?? '';

  // Fetch danh sách lô thuốc
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetAllBatches(branchId, {
      page: 1,
      limit: 50,
    });

  // Handle item press - navigate to batch detail
  const handleItemPress = (item: Batch) => {
    if (item._id) {
      navigation.navigate(
        ROUTES.BATCH_DETAIL as never,
        {
          id: item._id,
        } as never,
      );
    }
  };

  // Filter buttons
  const filterButtons = [
    { key: 'all', label: 'Tất cả', color: '#2196F3' },
    { key: 'active', label: 'Hoạt động', color: '#4CAF50' },
    { key: 'inactive', label: 'Không hoạt động', color: '#9E9E9E' },
  ] as const;

  // Filter data
  const filteredData = (data?.data || []).filter(item => {
    const matchesSearch =
      item.batch_number.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.supplier?.name || '')
        .toLowerCase()
        .includes(searchText.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'active') return item.status === 'active';
    if (selectedStatus === 'inactive') return item.status === 'inactive';

    return true;
  });

  // Render item
  const renderItem = ({ item }: { item: Batch }) => {
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

    const isExpiringSoon =
      new Date(item.expiry_date) <
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (
      <TouchableOpacity
        style={styles.medicineCard}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{item.batch_number}</Text>
            {item.supplier?.name && (
              <Text style={styles.genericName}>{item.supplier.name}</Text>
            )}
          </View>
          <View
            style={[
              styles.quantityBadge,
              item.quantity === 0 && styles.quantityBadgeEmpty,
              item.quantity < 20 &&
                item.quantity > 0 &&
                styles.quantityBadgeLow,
            ]}
          >
            <Text
              style={[
                styles.quantityText,
                (item.quantity === 0 || item.quantity < 20) &&
                  styles.quantityTextAlert,
              ]}
            >
              {item.quantity}
            </Text>
          </View>
        </View>

        <View style={styles.medicineDetails}>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Hạn sử dụng:</Text>{' '}
            {formatDate(item.expiry_date)}
            {isExpiringSoon && (
              <Text style={styles.expiringWarning}> (Sắp hết)</Text>
            )}
          </Text>
          <Text style={styles.detailRow}>
            <Text style={styles.label}>Giá nhập:</Text>{' '}
            {formatCurrency(item.import_price)}
          </Text>
          {item.batch_value && (
            <Text style={styles.detailRow}>
              <Text style={styles.label}>Giá trị lô:</Text>{' '}
              {formatCurrency(item.batch_value)}
            </Text>
          )}
        </View>

        <View style={styles.batchInfo}>
          <View style={styles.batchHeader}>
            <Icon
              name={item.status === 'active' ? 'check-circle' : 'close-circle'}
              size={16}
              color={item.status === 'active' ? '#4CAF50' : '#9E9E9E'}
            />
            <Text style={styles.batchTitle}>
              {item.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </Text>
          </View>
          {item.imported_at && (
            <Text style={styles.importDate}>
              Nhập ngày: {formatDate(item.imported_at)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="package-variant-closed" size={48} color="#CCC" />
        <Text style={styles.emptyText}>
          {searchText ? 'Không tìm thấy lô thuốc nào' : 'Chưa có lô thuốc nào'}
        </Text>
      </View>
    );
  };

  // Render error
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh sách Lô Thuốc</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#F44336" />
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách Lô Thuốc</Text>
        <Text style={styles.headerSubtitle}>
          {filteredData.length} loại thuốc
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thuốc..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        {filterButtons.map(button => (
          <TouchableOpacity
            key={button.key}
            style={[
              styles.filterButton,
              selectedStatus === button.key && {
                backgroundColor: button.color,
                borderColor: button.color,
              },
            ]}
            onPress={() => setSelectedStatus(button.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedStatus === button.key && styles.filterButtonTextActive,
              ]}
            >
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#0066CC']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  medicineCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  genericName: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  quantityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  quantityBadgeLow: {
    backgroundColor: '#FFF3E0',
  },
  quantityBadgeEmpty: {
    backgroundColor: '#FFEBEE',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  quantityTextAlert: {
    color: '#D32F2F',
  },
  medicineDetails: {
    backgroundColor: '#F9F9F9',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  detailRow: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  batchInfo: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 8,
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  batchTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066CC',
    marginLeft: 6,
  },
  batchItem: {
    marginLeft: 4,
    marginBottom: 4,
  },
  batchNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  batchDetail: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  moreBatches: {
    fontSize: 11,
    color: '#0066CC',
    fontWeight: '600',
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
    color: '#999',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    textAlign: 'center',
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  expiringWarning: {
    color: '#FF9800',
    fontWeight: '600',
  },
  importDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
