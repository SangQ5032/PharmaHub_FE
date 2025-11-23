// src/features/warehouse/screens/CrossBranchInventoryScreen.tsx

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
import { useGetCrossBranchInventory } from '@features/warehouse/hooks/useCrossBranchInventory';
import { CrossBranchInventoryCard } from '@features/warehouse/components/CrossBranchInventoryCard';
import { CrossBranchInventoryItem } from '@features/warehouse/types/cross-branch.types';
import { ROUTES } from '@shared/constants/routes';

/**
 * Màn hình xem tồn kho cross-branch (tất cả chi nhánh)
 * Hiển thị danh sách thuốc với tồn kho từ tất cả các chi nhánh
 */
export default function CrossBranchInventoryScreen() {
  const navigation = useNavigation();

  // State
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'all_in_stock' | 'some_out_of_stock' | 'all_out_of_stock'
  >('all');
  const [sortBy, setSortBy] = useState<
    'total_quantity' | 'medicine_name' | 'difference'
  >('total_quantity');

  // Fetch cross-branch inventory data
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetCrossBranchInventory({
      search: searchText,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      sort_by: sortBy,
      sort_order: sortBy === 'medicine_name' ? 'asc' : 'desc',
      limit: 50,
    });

  // Handle item press - Navigate to compare screen
  const handleItemPress = (item: CrossBranchInventoryItem) => {
    navigation.navigate(
      ROUTES.MEDICINE_COMPARE as never,
      {
        medicine_id: item.medicine_id,
        medicine_name: item.medicine_name,
      } as never,
    );
  };

  // Status filter buttons
  const statusFilters = [
    { key: 'all', label: 'Tất cả', icon: '📦' },
    { key: 'all_in_stock', label: 'Tất cả có hàng', icon: '🟢' },
    { key: 'some_out_of_stock', label: 'Một số hết', icon: '🟡' },
    { key: 'all_out_of_stock', label: 'Tất cả hết', icon: '🔴' },
  ] as const;

  // Sort options
  const sortOptions = [
    { key: 'total_quantity', label: 'Tổng tồn (Nhiều → Ít)' },
    { key: 'medicine_name', label: 'Tên thuốc (A → Z)' },
    { key: 'difference', label: 'Chênh lệch (Cao → Thấp)' },
  ] as const;

  // Render item
  const renderItem = ({ item }: { item: CrossBranchInventoryItem }) => (
    <CrossBranchInventoryCard
      item={item}
      onPress={() => handleItemPress(item)}
    />
  );

  // Render empty
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>
          {searchText
            ? 'Không tìm thấy thuốc nào'
            : 'Chưa có dữ liệu tồn kho cross-branch'}
        </Text>
      </View>
    );
  };

  // Render error
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tồn kho các chi nhánh</Text>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tồn kho các chi nhánh</Text>
        <Text style={styles.headerSubtitle}>
          So sánh tồn kho giữa các chi nhánh
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thuốc..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Status filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Trạng thái:</Text>
        <View style={styles.filterButtons}>
          {statusFilters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedStatus === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(filter.key)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === filter.key &&
                    styles.filterButtonTextActive,
                ]}
              >
                {filter.icon} {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        <View style={styles.sortButtons}>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                sortBy === option.key && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.key && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item.medicine_id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#2196F3']}
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
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
