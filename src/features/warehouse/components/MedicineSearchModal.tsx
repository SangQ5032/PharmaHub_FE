// src/features/warehouse/components/MedicineSearchModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useGetMedicines } from '@features/warehouse/hooks/useMedicines';
import { Medicine } from '@features/warehouse/types/medicine.types';

interface MedicineSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMedicine: (medicine: Medicine) => void;
}

export const MedicineSearchModal: React.FC<MedicineSearchModalProps> = ({
  visible,
  onClose,
  onSelectMedicine,
}) => {
  const [searchText, setSearchText] = useState('');

  // Fetch medicines với search query
  const { data, isLoading } = useGetMedicines({
    search: searchText,
    limit: 50,
  });

  // Handle select medicine
  const handleSelect = (medicine: Medicine) => {
    onSelectMedicine(medicine);
    setSearchText('');
    onClose();
  };

  // Render medicine item
  const renderItem = ({ item }: { item: Medicine }) => (
    <TouchableOpacity
      style={styles.medicineItem}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.medicineDetails}>
          <Text style={styles.medicineDetail}>
            {item.generic_name && `${item.generic_name}`}
          </Text>
          {item.dosage_form && (
            <Text style={styles.medicineDetail}>• {item.dosage_form}</Text>
          )}
          {item.strength && (
            <Text style={styles.medicineDetail}>• {item.strength}</Text>
          )}
        </View>
        {item.category_id && (
          <Text style={styles.medicineCategory}>{item.category_id.name}</Text>
        )}
      </View>
      <View style={styles.medicinePrice}>
        <Text style={styles.priceText}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(item.retail_price)}
        </Text>
        <Text style={styles.unitText}>/{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tìm kiếm thuốc</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập tên thuốc..."
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />

          {/* Medicine list */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
            </View>
          ) : (
            <FlatList
              data={data?.data || []}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchText
                      ? 'Không tìm thấy thuốc nào'
                      : 'Nhập tên thuốc để tìm kiếm'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#757575',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  medicineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  medicineDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  medicineDetail: {
    fontSize: 13,
    color: '#9E9E9E',
    marginRight: 4,
  },
  medicineCategory: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '500',
  },
  medicinePrice: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  unitText: {
    fontSize: 12,
    color: '#757575',
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
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});
