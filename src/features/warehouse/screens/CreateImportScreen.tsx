// src/features/warehouse/screens/CreateImportScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetSuppliers } from '@features/warehouse/hooks/useSuppliers';
import { useCreateImport } from '@features/warehouse/hooks/useImports';
import { MedicineSearchModal } from '@features/warehouse/components/MedicineSearchModal';
import { Medicine } from '@features/warehouse/types/medicine.types';
import { Supplier } from '@features/warehouse/types/supplier.types';
import { useAuthStore } from '@features/auth';

interface ImportItem {
  medicine: Medicine;
  quantity: number;
  unit: 'box' | 'blister' | 'tablet';
  unit_price: number;
  batch_number: string;
  expiry_date: string;
}

export default function CreateImportScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  // State
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<ImportItem[]>([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [showSupplierPicker, setShowSupplierPicker] = useState(false);
  const [note, setNote] = useState('');

  // Fetch active suppliers
  const { data: suppliersData, isLoading: loadingSuppliers } = useGetSuppliers({
    status: 'active',
  });

  // Create import mutation
  const createImportMutation = useCreateImport();

  // Handle add medicine
  const handleAddMedicine = (medicine: Medicine) => {
    // Check if medicine already exists
    const exists = items.find(item => item.medicine._id === medicine._id);
    if (exists) {
      Alert.alert('Thông báo', 'Thuốc này đã có trong danh sách');
      return;
    }

    // Add new item with default values
    setItems([
      ...items,
      {
        medicine,
        quantity: 1,
        unit: 'tablet', // Default to tablet (base unit)
        unit_price: medicine.retail_price || 0,
        batch_number: '',
        expiry_date: '',
      },
    ]);
  };

  // Handle remove medicine
  const handleRemoveMedicine = (medicineId: string) => {
    setItems(items.filter(item => item.medicine._id !== medicineId));
  };

  // Handle update quantity
  const handleUpdateQuantity = (medicineId: string, quantity: number) => {
    setItems(
      items.map(item =>
        item.medicine._id === medicineId ? { ...item, quantity } : item,
      ),
    );
  };

  // Handle update unit price
  const handleUpdateUnitPrice = (medicineId: string, unit_price: number) => {
    setItems(
      items.map(item =>
        item.medicine._id === medicineId ? { ...item, unit_price } : item,
      ),
    );
  };

  // Handle update batch number
  const handleUpdateBatchNumber = (
    medicineId: string,
    batch_number: string,
  ) => {
    setItems(
      items.map(item =>
        item.medicine._id === medicineId ? { ...item, batch_number } : item,
      ),
    );
  };

  // Handle update expiry date
  const handleUpdateExpiryDate = (medicineId: string, expiry_date: string) => {
    setItems(
      items.map(item =>
        item.medicine._id === medicineId ? { ...item, expiry_date } : item,
      ),
    );
  };

  // Handle update unit
  const handleUpdateUnit = (
    medicineId: string,
    unit: 'box' | 'blister' | 'tablet',
  ) => {
    setItems(
      items.map(item =>
        item.medicine._id === medicineId ? { ...item, unit } : item,
      ),
    );
  };

  // Calculate total cost
  const totalCost = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  // Handle submit
  const handleSubmit = async () => {
    // Validate
    if (!selectedSupplier) {
      Alert.alert('Lỗi', 'Vui lòng chọn nhà cung cấp');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất 1 thuốc');
      return;
    }

    // Check all items have valid quantity, price, batch_number, and expiry_date
    const invalidItem = items.find(
      item =>
        item.quantity <= 0 ||
        item.unit_price < 0 ||
        !item.batch_number.trim() ||
        !item.expiry_date.trim(),
    );
    if (invalidItem) {
      Alert.alert(
        'Lỗi',
        'Số lượng phải > 0, đơn giá phải ≥ 0, và mã lô, ngày hết hạn không được để trống',
      );
      return;
    }

    // Validate expiry date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const invalidExpiryItem = items.find(item => {
      const expiryDate = new Date(item.expiry_date);
      return expiryDate < today;
    });
    if (invalidExpiryItem) {
      Alert.alert('Lỗi', 'Ngày hết hạn không được quá khứ');
      return;
    }

    // Prepare data
    const body = {
      branch_id: user.branch_id,
      supplier_id: selectedSupplier._id,
      items: items.map(item => ({
        medicine_id: item.medicine._id,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        batch_number: item.batch_number.trim(),
        expiry_date: item.expiry_date,
      })),
      note: note.trim() || undefined,
    };

    // Submit
    try {
      await createImportMutation.mutateAsync(body);
      Alert.alert('Thành công', 'Tạo phiếu nhập hàng thành công', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tạo phiếu nhập');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo phiếu nhập mới</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Supplier selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhà cung cấp *</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setShowSupplierPicker(!showSupplierPicker)}
          >
            <Text style={styles.pickerText}>
              {selectedSupplier?.name || 'Chọn nhà cung cấp'}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>

          {/* Supplier list */}
          {showSupplierPicker && (
            <ScrollView style={styles.supplierList} nestedScrollEnabled={true}>
              {loadingSuppliers ? (
                <ActivityIndicator
                  size="small"
                  color="#4CAF50"
                  style={{ paddingVertical: 12 }}
                />
              ) : suppliersData?.data && suppliersData.data.length > 0 ? (
                suppliersData.data.map(supplier => (
                  <TouchableOpacity
                    key={supplier._id}
                    style={[
                      styles.supplierItem,
                      selectedSupplier?._id === supplier._id &&
                        styles.supplierItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedSupplier(supplier);
                      setShowSupplierPicker(false);
                    }}
                  >
                    <View style={styles.supplierInfo}>
                      <Text style={styles.supplierName}>{supplier.name}</Text>
                      <Text style={styles.supplierContact}>
                        📞 {supplier.contact.phone}
                      </Text>
                      {supplier.contact.email && (
                        <Text style={styles.supplierEmail}>
                          ✉️ {supplier.contact.email}
                        </Text>
                      )}
                      {supplier.contact.address && (
                        <Text style={styles.supplierAddress}>
                          📍 {supplier.contact.address}
                        </Text>
                      )}
                      {supplier.note && (
                        <Text style={styles.supplierNote}>
                          📝 {supplier.note}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Không có nhà cung cấp hoạt động
                </Text>
              )}
            </ScrollView>
          )}
        </View>

        {/* Medicine list */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh sách thuốc *</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowMedicineModal(true)}
            >
              <Text style={styles.addButtonText}>+ Thêm thuốc</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có thuốc nào</Text>
          ) : (
            items.map(item => (
              <View key={item.medicine._id} style={styles.medicineItem}>
                <View style={styles.medicineHeader}>
                  <Text style={styles.medicineName}>{item.medicine.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveMedicine(item.medicine._id)}
                  >
                    <Text style={styles.removeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.medicineInputs}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Đơn vị *</Text>
                    <View style={styles.unitSelector}>
                      {(['box', 'blister', 'tablet'] as const).map(unit => (
                        <TouchableOpacity
                          key={unit}
                          style={[
                            styles.unitButton,
                            item.unit === unit && styles.unitButtonActive,
                          ]}
                          onPress={() =>
                            handleUpdateUnit(item.medicine._id, unit)
                          }
                        >
                          <Text
                            style={[
                              styles.unitButtonText,
                              item.unit === unit && styles.unitButtonTextActive,
                            ]}
                          >
                            {unit === 'box'
                              ? 'Hộp'
                              : unit === 'blister'
                              ? 'Vỉ'
                              : 'Viên'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Số lượng</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(item.quantity)}
                      onChangeText={text =>
                        handleUpdateQuantity(
                          item.medicine._id,
                          parseInt(text) || 0,
                        )
                      }
                    />
                  </View>
                </View>

                <View style={styles.medicineInputs}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Đơn giá (
                      {item.unit === 'box'
                        ? 'hộp'
                        : item.unit === 'blister'
                        ? 'vỉ'
                        : 'viên'}
                      )
                    </Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={String(item.unit_price)}
                      onChangeText={text =>
                        handleUpdateUnitPrice(
                          item.medicine._id,
                          parseInt(text) || 0,
                        )
                      }
                    />
                  </View>
                </View>

                <View style={styles.medicineInputs}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Mã lô hàng *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="VD: LOT202311001"
                      value={item.batch_number}
                      onChangeText={text =>
                        handleUpdateBatchNumber(item.medicine._id, text)
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ngày hết hạn *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={item.expiry_date}
                      onChangeText={text =>
                        handleUpdateExpiryDate(item.medicine._id, text)
                      }
                    />
                  </View>
                </View>

                <Text style={styles.itemTotal}>
                  Thành tiền: {formatCurrency(item.quantity * item.unit_price)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Total cost */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Tổng chi phí:</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalCost)}</Text>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Ghi chú về phiếu nhập (tùy chọn)"
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>

      {/* Submit button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            createImportMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createImportMutation.isPending}
        >
          {createImportMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Lưu phiếu nhập</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Medicine search modal */}
      <MedicineSearchModal
        visible={showMedicineModal}
        onClose={() => setShowMedicineModal(false)}
        onSelectMedicine={handleAddMedicine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#212121',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#757575',
  },
  supplierList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    maxHeight: 300,
  },
  supplierItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  supplierItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  supplierInfo: {
    gap: 4,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  supplierContact: {
    fontSize: 13,
    color: '#555555',
  },
  supplierEmail: {
    fontSize: 13,
    color: '#555555',
  },
  supplierAddress: {
    fontSize: 13,
    color: '#555555',
  },
  supplierNote: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    paddingVertical: 24,
  },
  medicineItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  removeButton: {
    fontSize: 20,
    color: '#F44336',
    padding: 4,
  },
  medicineInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'right',
  },
  totalSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  noteInput: {
    paddingVertical: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  unitButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
