import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreateInvoice } from '../hooks/useSales';
import { useMedicinesWithBatches } from '../hooks/useMedicines';
import { useGetCustomers } from '../hooks/useCustomers';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import { SaleItem, CreateInvoiceRequest } from '../types';

const CreateInvoiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const branchId = user?.branch_id || '';

  const { mutate: createInvoiceMutation, isPending } = useCreateInvoice();
  const { data: medicinesResponse, isLoading: medicinesLoading } =
    useMedicinesWithBatches(branchId, 1, 50);
  const { data: customersData, isLoading: customersLoading } = useGetCustomers(
    1,
    50,
  );

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'card' | 'transfer'
  >('cash');
  const [discount, setDiscount] = useState('0');
  const [taxRate, setTaxRate] = useState('0');
  const [note, setNote] = useState('');

  // Items state
  const [items, setItems] = useState<SaleItem[]>([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [selectedMedicineQuantity, setSelectedMedicineQuantity] = useState('1');
  const [selectedMedicinePrice, setSelectedMedicinePrice] = useState('');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');

  // Customer selection state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const medicines = medicinesResponse?.data || [];
  const customers = customersData || [];

  const filteredMedicines = medicines.filter((med: any) =>
    med.name.toLowerCase().includes(medicineSearchQuery.toLowerCase()),
  );

  const filteredCustomers = customers.filter(
    (cust: any) =>
      cust.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      cust.phone.includes(customerSearchQuery),
  );

  const handleSelectCustomer = (customer: any) => {
    setCustomerId(customer._id);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerSearchQuery('');
    setShowCustomerModal(false);
  };

  const handleSelectMedicine = (medicine: any) => {
    setSelectedMedicineId(medicine._id);
    setSelectedMedicinePrice(
      String(medicine.retail_price || medicine.price || 0),
    );
    setMedicineSearchQuery(medicine.name);
    setShowMedicineModal(false);
  };

  const handleAddItem = () => {
    if (!selectedMedicineId) {
      Alert.alert('Lỗi', 'Vui lòng chọn thuốc');
      return;
    }
    if (!selectedMedicineQuantity || Number(selectedMedicineQuantity) <= 0) {
      Alert.alert('Lỗi', 'Số lượng không hợp lệ');
      return;
    }
    if (!selectedMedicinePrice || Number(selectedMedicinePrice) < 0) {
      Alert.alert('Lỗi', 'Giá bán không hợp lệ');
      return;
    }

    const newItem: SaleItem = {
      medicine_id: selectedMedicineId,
      quantity: Number(selectedMedicineQuantity),
      unit_price: Number(selectedMedicinePrice),
    };

    setItems([...items, newItem]);

    // Reset form
    setSelectedMedicineId('');
    setSelectedMedicineQuantity('1');
    setSelectedMedicinePrice('');
    setMedicineSearchQuery('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
    const discountAmount = Number(discount) || 0;
    const taxRatePercent = Number(taxRate) || 0;
    const taxAmount = ((subtotal - discountAmount) * taxRatePercent) / 100;
    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  };

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

  const handleSubmit = async () => {
    // Validation
    if (!customerName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên khách hàng');
      return;
    }
    if (!customerPhone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại khách hàng');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một sản phẩm');
      return;
    }

    const invoiceData: CreateInvoiceRequest = {
      items,
      discount: discountAmount,
      tax_rate: Number(taxRate) || 0,
      payment_method: paymentMethod,
      customer_id: customerId || undefined,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      note: note.trim() || undefined,
    };

    createInvoiceMutation(invoiceData, {
      onSuccess: response => {
        Alert.alert(
          'Thành công',
          `Tạo hóa đơn thành công!\nMã hóa đơn: ${response.data.invoice_code}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ],
        );
      },
      onError: (error: any) => {
        Alert.alert(
          'Lỗi',
          error?.response?.data?.message || 'Tạo hóa đơn thất bại',
        );
      },
    });
  };

  const getMedicineName = (medicineId: string) => {
    return (
      medicines.find((m: any) => m._id === medicineId)?.name || 'Không xác định'
    );
  };

  const getMedicineUnit = (medicineId: string) => {
    return medicines.find((m: any) => m._id === medicineId)?.unit || '';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>

          {customersLoading ? (
            <ActivityIndicator size="large" color="#0066CC" />
          ) : (
            <>
              <TouchableOpacity
                style={styles.medicineSelectButton}
                onPress={() => setShowCustomerModal(true)}
                disabled={isPending}
              >
                <Text style={styles.medicineSelectButtonText}>
                  {customerName
                    ? `${customerName} (${customerPhone})`
                    : 'Chọn khách hàng từ danh sách'}
                </Text>
              </TouchableOpacity>

              {customerName && (
                <TouchableOpacity
                  style={styles.changeCustomerButton}
                  onPress={() => {
                    setCustomerId('');
                    setCustomerName('');
                    setCustomerPhone('');
                  }}
                >
                  <Text style={styles.changeCustomerButtonText}>
                    Thay đổi khách hàng
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Medicine Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thêm sản phẩm</Text>

          {medicinesLoading ? (
            <ActivityIndicator size="large" color="#0066CC" />
          ) : (
            <>
              <TouchableOpacity
                style={styles.medicineSelectButton}
                onPress={() => setShowMedicineModal(true)}
                disabled={isPending}
              >
                <Text style={styles.medicineSelectButtonText}>
                  {medicineSearchQuery || 'Chọn thuốc/sản phẩm'}
                </Text>
              </TouchableOpacity>

              <View style={styles.quantityPriceRow}>
                <View style={[styles.inputContainer, styles.quantityInput]}>
                  <Text style={styles.label}>Số lượng</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={selectedMedicineQuantity}
                    onChangeText={setSelectedMedicineQuantity}
                    keyboardType="number-pad"
                    editable={!isPending}
                  />
                </View>
                <View style={[styles.inputContainer, styles.priceInput]}>
                  <Text style={styles.label}>Giá bán</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={selectedMedicinePrice}
                    onChangeText={setSelectedMedicinePrice}
                    keyboardType="decimal-pad"
                    editable={!isPending}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddItem}
                disabled={isPending}
              >
                <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Items List */}
        {items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Danh sách sản phẩm ({items.length})
            </Text>
            {items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>
                    {getMedicineName(item.medicine_id)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(index)}
                    disabled={isPending}
                  >
                    <Text style={styles.deleteButton}>Xóa</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDetail}>
                    Số lượng: {item.quantity}{' '}
                    {getMedicineUnit(item.medicine_id)}
                  </Text>
                  <Text style={styles.itemDetail}>
                    Giá: {Number(item.unit_price).toLocaleString('vi-VN')}₫
                  </Text>
                  <Text style={styles.itemTotal}>
                    Thành tiền:{' '}
                    {(item.quantity * item.unit_price).toLocaleString('vi-VN')}₫
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment and Discount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thanh toán</Text>

          <View style={styles.paymentMethodContainer}>
            <Text style={styles.label}>Phương thức thanh toán</Text>
            <View style={styles.paymentMethods}>
              {(['cash', 'card', 'transfer'] as const).map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentMethodButton,
                    paymentMethod === method &&
                      styles.paymentMethodButtonActive,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                  disabled={isPending}
                >
                  <Text
                    style={[
                      styles.paymentMethodText,
                      paymentMethod === method &&
                        styles.paymentMethodTextActive,
                    ]}
                  >
                    {method === 'cash' && 'Tiền mặt'}
                    {method === 'card' && 'Thẻ'}
                    {method === 'transfer' && 'Chuyển khoản'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.discountTaxRow}>
            <View style={[styles.inputContainer, styles.discountInput]}>
              <Text style={styles.label}>Chiết khấu</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={discount}
                onChangeText={setDiscount}
                keyboardType="decimal-pad"
                editable={!isPending}
              />
            </View>
            <View style={[styles.inputContainer, styles.taxInput]}>
              <Text style={styles.label}>Thuế (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="decimal-pad"
                editable={!isPending}
              />
            </View>
          </View>

          <TextInput
            style={styles.noteInput}
            placeholder="Ghi chú"
            value={note}
            onChangeText={setNote}
            multiline
            editable={!isPending}
          />
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền hàng:</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Chiết khấu:</Text>
            <Text style={styles.summaryValue}>
              -{discountAmount.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thuế:</Text>
            <Text style={styles.summaryValue}>
              {taxAmount.toLocaleString('vi-VN')}₫
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>
              {total.toLocaleString('vi-VN')}₫
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Tạo hóa đơn</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Medicine Selection Modal */}
      <Modal
        visible={showMedicineModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMedicineModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn thuốc/sản phẩm</Text>
              <TouchableOpacity onPress={() => setShowMedicineModal(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm thuốc..."
              value={medicineSearchQuery}
              onChangeText={setMedicineSearchQuery}
            />

            <FlatList
              data={filteredMedicines}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.medicineListItem,
                    (!item.total_quantity || item.total_quantity === 0) &&
                      styles.medicineListItemOutOfStock,
                  ]}
                  onPress={() => handleSelectMedicine(item)}
                  disabled={!item.total_quantity || item.total_quantity === 0}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.medicineInfo}>
                      Giá:{' '}
                      {Number(
                        item.retail_price || item.price || 0,
                      ).toLocaleString('vi-VN')}
                      ₫ | {item.unit || 'viên'}
                    </Text>
                    <Text style={styles.medicineInfo}>
                      Tồn kho: {item.total_quantity || 0} {item.unit || 'viên'}
                      {item.batch_count ? ` (${item.batch_count} lô)` : ''}
                      {(!item.total_quantity || item.total_quantity === 0) &&
                        ' | Hết hàng'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Customer Selection Modal */}
      <Modal
        visible={showCustomerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn khách hàng</Text>
              <TouchableOpacity onPress={() => setShowCustomerModal(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm khách hàng (tên hoặc SĐT)..."
              value={customerSearchQuery}
              onChangeText={setCustomerSearchQuery}
            />

            <FlatList
              data={filteredCustomers}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.medicineListItem}
                  onPress={() => handleSelectCustomer(item)}
                >
                  <View>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    <Text style={styles.medicineInfo}>
                      SĐT: {item.phone} | Đã chi tiêu:{' '}
                      {Number(item.total_spent || 0).toLocaleString('vi-VN')}₫
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không tìm thấy khách hàng</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quantityInput: {
    flex: 1,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
  },
  discountTaxRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  discountInput: {
    flex: 1,
    marginRight: 8,
  },
  taxInput: {
    flex: 1,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  medicineSelectButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#F9F9F9',
  },
  medicineSelectButtonText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#0066CC',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDetails: {
    gap: 4,
  },
  itemDetail: {
    fontSize: 12,
    color: '#666',
  },
  itemTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
  },
  paymentMethodContainer: {
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentMethodButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  paymentMethodTextActive: {
    color: '#FFF',
  },
  summarySection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666',
  },
  summaryValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0066CC',
  },
  submitButton: {
    backgroundColor: '#00AA44',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '80%',
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 10,
    margin: 12,
    fontSize: 14,
  },
  medicineListItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  medicineListItemOutOfStock: {
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 2,
    opacity: 0.6,
    marginVertical: 4,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  medicineInfo: {
    fontSize: 12,
    color: '#666',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  changeCustomerButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFC107',
    alignItems: 'center',
  },
  changeCustomerButtonText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
});

export default CreateInvoiceScreen;
