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
import { useGetInventoryByBranch } from '@features/warehouse/hooks/useInventory';
import { InventoryCard } from '@features/warehouse/components/InventoryCard';
import { InventoryItem } from '@features/warehouse/types/inventory.types';
import { ROUTES } from '@shared/constants/routes';

export default function InventoryListScreen() {
  const navigation = useNavigation();

  // State
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'normal' | 'low' | 'out_of_stock'
  >('all');

  // TODO: Get branchId from user's current branch
  const branchId = '507f1f77bcf86cd799439011';

  // Fetch inventory data
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useGetInventoryByBranch(branchId, {
      search: searchText,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      limit: 50,
    });

  // Handle item press
  const handleItemPress = (item: InventoryItem) => {
    // Navigate to detail screen
    navigation.navigate(
      ROUTES.INVENTORY_DETAIL as never,
      {
        id: item._id,
      } as never,
    );
  };

  // Filter buttons
  const filterButtons = [
    { key: 'all', label: 'Tất cả', color: '#2196F3' },
    { key: 'normal', label: 'Bình thường', color: '#4CAF50' },
    { key: 'low', label: 'Sắp hết', color: '#FF9800' },
    { key: 'out_of_stock', label: 'Hết hàng', color: '#F44336' },
  ] as const;

  // Render item
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <InventoryCard item={item} onPress={() => handleItemPress(item)} />
  );

  // Render empty
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchText ? 'Không tìm thấy thuốc nào' : 'Chưa có dữ liệu tồn kho'}
        </Text>
      </View>
    );
  };

  // Render error
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tồn kho</Text>
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
        <Text style={styles.headerTitle}>Tồn kho</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thuốc..."
          value={searchText}
          onChangeText={setSearchText}
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

      {/* Summary */}
      {data?.data && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Tổng: <Text style={styles.summaryValue}>{data.data.length}</Text>{' '}
            thuốc
          </Text>
        </View>
      )}

      {/* List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={['#4CAF50']}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryText: {
    fontSize: 14,
    color: '#757575',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#4CAF50',
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
    color: '#757575',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
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
