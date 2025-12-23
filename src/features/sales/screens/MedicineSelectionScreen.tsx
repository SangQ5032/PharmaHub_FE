import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMedicinesWithBatches } from '../hooks/useMedicines';
import { useAuthStore } from '../../auth/stores/useAuthStore';

const MedicineSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  const branchId = user?.branch_id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch medicines
  const { data: medicinesResponse, isLoading: medicinesLoading } =
    useMedicinesWithBatches(branchId, 1, 50);

  // Filter và sort medicines
  const filteredMedicines = useMemo(() => {
    const medicines = medicinesResponse?.data || [];

    const filtered = medicines.filter(
      (med: any) =>
        med?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        med?.generic_name
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        med?.barcode?.includes(debouncedSearchQuery),
    );

    // Sort medicines
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'vi');
        case 'price': {
          const priceA = a.retail_price || a.price || 0;
          const priceB = b.retail_price || b.price || 0;
          return priceA - priceB;
        }
        case 'stock':
          return (b.total_quantity || 0) - (a.total_quantity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [medicinesResponse?.data, debouncedSearchQuery, sortBy]);

  const handleSelectMedicine = (medicine: any) => {
    // Navigate back với medicine đã chọn
    navigation.navigate('SalesMedicineDetail', {
      medicine,
      onAddMedicine: route.params?.onAddMedicine,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn thuốc/sản phẩm</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, hoạt chất, barcode..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => {
              setSearchQuery('');
              setDebouncedSearchQuery('');
            }}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        <View style={styles.sortButtons}>
          {(['name', 'price', 'stock'] as const).map(sort => (
            <TouchableOpacity
              key={sort}
              style={[
                styles.sortButton,
                sortBy === sort && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(sort)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === sort && styles.sortButtonTextActive,
                ]}
              >
                {sort === 'name' && 'Tên'}
                {sort === 'price' && 'Giá'}
                {sort === 'stock' && 'Tồn kho'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      {filteredMedicines.length > 0 && (
        <View style={styles.resultsCountContainer}>
          <Text style={styles.resultsCountText}>
            Tìm thấy {filteredMedicines.length} sản phẩm
          </Text>
        </View>
      )}

      {/* Medicine List */}
      {medicinesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Đang tải danh sách thuốc...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.medicineCard,
                (!item.total_quantity || item.total_quantity === 0) &&
                  styles.medicineCardOutOfStock,
              ]}
              onPress={() => handleSelectMedicine(item)}
              disabled={!item.total_quantity || item.total_quantity === 0}
              activeOpacity={0.7}
            >
              <View style={styles.medicineCardContent}>
                <View style={styles.medicineCardHeader}>
                  <Text style={styles.medicineCardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  {(!item.total_quantity || item.total_quantity === 0) && (
                    <View style={styles.outOfStockBadge}>
                      <Text style={styles.outOfStockText}>Hết hàng</Text>
                    </View>
                  )}
                </View>

                {item.generic_name && (
                  <Text style={styles.medicineGenericName} numberOfLines={1}>
                    {item.generic_name}
                  </Text>
                )}

                <View style={styles.medicineCardDetails}>
                  <View style={styles.medicineDetailRow}>
                    <Text style={styles.medicineDetailLabel}>Giá:</Text>
                    <Text style={styles.medicineDetailValue}>
                      {Number(
                        item.retail_price || item.price || 0,
                      ).toLocaleString('vi-VN')}
                      ₫/{item.unit || 'viên'}
                    </Text>
                  </View>

                  <View style={styles.medicineDetailRow}>
                    <Text style={styles.medicineDetailLabel}>Tồn kho:</Text>
                    <Text
                      style={[
                        styles.medicineDetailValue,
                        (!item.total_quantity || item.total_quantity === 0) &&
                          styles.medicineDetailValueOutOfStock,
                      ]}
                    >
                      {item.total_quantity || 0} {item.unit || 'viên'}
                      {item.batch_count ? ` (${item.batch_count} lô)` : ''}
                    </Text>
                  </View>

                  {item.category_name && (
                    <View style={styles.medicineDetailRow}>
                      <Text style={styles.medicineCategoryBadge}>
                        {item.category_name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {debouncedSearchQuery
                  ? 'Không tìm thấy sản phẩm phù hợp'
                  : 'Nhập từ khóa để tìm kiếm thuốc'}
              </Text>
              {debouncedSearchQuery && (
                <TouchableOpacity
                  style={styles.clearSearchLink}
                  onPress={() => {
                    setSearchQuery('');
                    setDebouncedSearchQuery('');
                  }}
                >
                  <Text style={styles.clearSearchLinkText}>Xóa bộ lọc</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          contentContainerStyle={styles.medicineListContent}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  placeholder: {
    width: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 14,
    backgroundColor: '#F5F5F5',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  clearSearchText: {
    fontSize: 18,
    color: '#999',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  sortButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#FFF',
  },
  resultsCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F7FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsCountText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
  medicineListContent: {
    padding: 16,
    paddingTop: 8,
  },
  medicineCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicineCardOutOfStock: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
    borderColor: '#CCC',
  },
  medicineCardContent: {
    flex: 1,
  },
  medicineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  medicineCardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  outOfStockBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  medicineGenericName: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  medicineCardDetails: {
    gap: 6,
  },
  medicineDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  medicineDetailLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 4,
    fontWeight: '500',
  },
  medicineDetailValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '600',
  },
  medicineDetailValueOutOfStock: {
    color: '#FF4444',
  },
  medicineCategoryBadge: {
    fontSize: 11,
    color: '#0066CC',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 14,
    marginBottom: 12,
  },
  clearSearchLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearSearchLinkText: {
    color: '#0066CC',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default MedicineSelectionScreen;
