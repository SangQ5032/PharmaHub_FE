/* eslint-disable react-hooks/exhaustive-deps */
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
  BackHandler,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { useCreateInvoice } from '../hooks/useSales';
import { useMedicinesWithBatches } from '../hooks/useMedicines';
import { useGetCustomers } from '../hooks/useCustomers';
import { useAuthStore } from '../../auth/stores/useAuthStore';
import { SaleItem, CreateInvoiceRequest } from '../types';

const CreateInvoiceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  const branchId = user?.branch_id || '';

  // Disable back button and handle back gesture
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate to Home instead of going back
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeTabs' }],
        });
        return true;
      };

      // Subscribe to hardware back press
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  const { mutate: createInvoiceMutation, isPending } = useCreateInvoice();
  // const { data: medicinesResponse, isLoading: medicinesLoading } =
  //   useMedicinesWithBatches(branchId, 1, 50);
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
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [note, setNote] = useState('');

  // Thêm state cho discount và tax
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [maxDiscountEligible, setMaxDiscountEligible] = useState(0);
  const [discountError, setDiscountError] = useState(''); // Thêm state để lưu lỗi

  // Items state
  const [items, setItems] = useState<SaleItem[]>([]);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [medicineSearchQuery, setMedicineSearchQuery] = useState('');

  // Customer selection state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Handle new customer from CreateCustomerScreen
  React.useEffect(() => {
    if (route.params?.newCustomer) {
      const newCustomer = route.params.newCustomer;
      setCustomerId(newCustomer._id);
      setCustomerName(newCustomer.name);
      setCustomerPhone(newCustomer.phone);
      // Clear the params so it doesn't auto-select on subsequent visits
      navigation.setParams({ newCustomer: undefined });
    }

    // Handle new item from barcode scanner
    if (route.params?.newItem) {
      const newItem = route.params.newItem;
      setItems([...items, newItem]);
      // Clear the params
      navigation.setParams({ newItem: undefined });
    }
  }, [route.params?.newCustomer, route.params?.newItem, navigation, items]);

  // Thêm useEffect để reset discount khi thay đổi khách hàng
  React.useEffect(() => {
    if (!customerId) {
      setMaxDiscountEligible(0);
      setDiscount(0);
    }
  }, [customerId]);

  // Thêm hàm validate discount
  const validateDiscount = (value: number): string => {
    if (value < 0) {
      return 'Chiết khấu không được âm';
    }
    if (value > 0 && value < 1000) {
      return 'Chiết khấu tối thiểu phải là 1,000₫';
    }
    if (customerId && value > maxDiscountEligible) {
      return `Chiết khấu không được vượt quá ${maxDiscountEligible.toLocaleString(
        'vi-VN',
      )}₫ (chiết khấu tối đa)`;
    }
    if (value > subtotal) {
      return 'Chiết khấu không được vượt quá tổng tiền hàng';
    }
    return '';
  };

  // Cập nhật useEffect để reset discount error khi thay đổi khách hàng hoặc subtotal
  React.useEffect(() => {
    if (!customerId) {
      setMaxDiscountEligible(0);
      setDiscount(0);
      setDiscountError('');
    } else if (discount > 0) {
      // Re-validate khi subtotal thay đổi
      const error = validateDiscount(discount);
      setDiscountError(error);
    }
  }, [customerId, subtotal, maxDiscountEligible]);

  const medicines = medicinesResponse?.data || [];
  const customers = customersData?.data || []; // Sửa: thêm .data để lấy mảng từ response object

  const filteredMedicines = medicines.filter((med: any) =>
    med?.name?.toLowerCase().includes(medicineSearchQuery.toLowerCase()),
  );

  const filteredCustomers = customers.filter(
    (cust: any) =>
      cust?.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      cust?.phone?.includes(customerSearchQuery),
  );

  const handleSelectCustomer = (customer: any) => {
    setCustomerId(customer._id);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setCustomerSearchQuery('');
    setShowCustomerModal(false);

    // Tính toán max_discount_eligible từ total_spent
    const totalSpent = customer.total_spent || 0;
    const maxDiscount = Math.floor(totalSpent / 100000) * 1000;
    setMaxDiscountEligible(maxDiscount);

    // Reset discount về 0 khi chọn khách hàng mới
    setDiscount(0);
  };

  const handleSelectMedicine = (medicine: any) => {
    setShowMedicineModal(false);
    setMedicineSearchQuery('');
    navigation.navigate('SalesMedicineDetail', {
      medicine,
      onAddMedicine: (
        selectedMedicine: any,
        quantity: number,
        unit: 'box' | 'blister' | 'tablet',
        price?: number,
        batchId?: string,
        batchNumber?: string,
      ) => {
        // Get price from medicine prices if available, otherwise use retail_price
        const unitPrice =
          price ||
          selectedMedicine?.prices?.price_per_unit?.[unit] ||
          selectedMedicine?.prices?.unit_prices?.[unit] ||
          selectedMedicine?.retail_price ||
          0;

        const newItem: SaleItem = {
          medicine_id: selectedMedicine._id,
          quantity,
          unit,
          unit_price: unitPrice,
          batch_id: batchId, // Thêm batch_id nếu có
          batch_number: batchNumber, // Thêm batch_number để hiển thị
        };
        setItems([...items, newItem]);
      },
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * (item.unit_price || 0),
      0,
    );

    // Áp dụng discount (không được vượt quá subtotal hoặc maxDiscountEligible)
    const appliedDiscount = Math.min(
      discount,
      subtotal,
      maxDiscountEligible || subtotal,
    );

    // Tính taxable amount sau khi trừ discount
    const taxableAmount = subtotal - appliedDiscount;

    // Tính tax amount
    const taxAmount = (taxRate / 100) * taxableAmount;

    // Tính total amount
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discount: appliedDiscount,
      taxRate,
      taxAmount,
      total,
    };
  };

  const {
    subtotal,
    discount: appliedDiscount,
    taxRate: appliedTaxRate,
    taxAmount,
    total,
  } = calculateTotals();

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

    // Validate all items have unit
    const itemsWithoutUnit = items.filter(item => !item.unit);
    if (itemsWithoutUnit.length > 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn đơn vị cho tất cả sản phẩm');
      return;
    }

    // Validate discount
    if (discount < 0) {
      Alert.alert('Lỗi', 'Chiết khấu không được âm');
      return;
    }
    if (discount > 0 && discount < 1000) {
      Alert.alert('Lỗi', 'Chiết khấu tối thiểu phải là 1,000₫');
      return;
    }
    if (discount > subtotal) {
      Alert.alert('Lỗi', 'Chiết khấu không được vượt quá tổng tiền hàng');
      return;
    }
    if (customerId && discount > maxDiscountEligible) {
      Alert.alert(
        'Lỗi',
        `Chiết khấu không được vượt quá ${maxDiscountEligible.toLocaleString(
          'vi-VN',
        )}₫ (chiết khấu tối đa)`,
      );
      return;
    }
    if (discountError) {
      Alert.alert('Lỗi', discountError);
      return;
    }

    // Validate tax rate
    if (taxRate < 0 || taxRate > 100) {
      Alert.alert('Lỗi', 'Thuế suất phải từ 0 đến 100%');
      return;
    }

    // Prepare items for API (include batch_id if present, ensure unit is present)
    const apiItems = items.map(item => ({
      medicine_id: item.medicine_id,
      quantity: item.quantity,
      unit: item.unit,
      ...(item.batch_id && { batch_id: item.batch_id }), // Thêm batch_id nếu có
    }));

    const invoiceData: CreateInvoiceRequest = {
      branch_id: branchId,
      items: apiItems,
      discount: appliedDiscount,
      tax_rate: taxRate,
      payment_method: paymentMethod,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_id: customerId || undefined,
      note: note.trim() || undefined,
    };

    // If payment method is bank (transfer), navigate to QR screen
    if (paymentMethod === 'bank') {
      navigation.navigate('PaymentQR', {
        invoiceData,
        total,
      });
      return;
    }

    // For cash payment, create invoice directly
    createInvoiceMutation(invoiceData, {
      onSuccess: response => {
        Alert.alert(
          'Thành công',
          `Tạo hóa đơn thành công!\nMã hóa đơn: ${response.data.invoice_code}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to Home instead of Sales
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeTabs' }],
                });
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

              <TouchableOpacity
                style={styles.createCustomerButton}
                onPress={() => navigation.navigate('CreateCustomer')}
                disabled={isPending}
              >
                <Text style={styles.createCustomerButtonText}>
                  + Tạo mới khách hàng
                </Text>
              </TouchableOpacity>
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

              <TouchableOpacity
                style={styles.barcodeScanButton}
                onPress={() => navigation.navigate('BarcodeScanner')}
                disabled={isPending}
              >
                <Text style={styles.barcodeScanButtonText}>
                  📷 Scan barcode
                </Text>
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
                    Đơn vị:{' '}
                    {item.unit === 'box'
                      ? 'Hộp'
                      : item.unit === 'blister'
                      ? 'Vỉ'
                      : 'Viên'}
                  </Text>
                  <Text style={styles.itemDetail}>
                    Số lượng: {item.quantity}{' '}
                    {item.unit === 'box'
                      ? 'hộp'
                      : item.unit === 'blister'
                      ? 'vỉ'
                      : 'viên'}
                  </Text>
                  {item.batch_number && (
                    <Text style={styles.itemDetail}>
                      Lô: {item.batch_number}
                    </Text>
                  )}
                  <Text style={styles.itemDetail}>
                    Giá: {Number(item.unit_price || 0).toLocaleString('vi-VN')}
                    ₫/
                    {item.unit === 'box'
                      ? 'hộp'
                      : item.unit === 'blister'
                      ? 'vỉ'
                      : 'viên'}
                  </Text>
                  <Text style={styles.itemTotal}>
                    Thành tiền:{' '}
                    {(item.quantity * (item.unit_price || 0)).toLocaleString(
                      'vi-VN',
                    )}
                    ₫
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <View style={styles.paymentMethodContainer}>
            <View style={styles.paymentMethods}>
              {(['cash', 'bank'] as const).map(method => (
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
                    {method === 'bank' && 'Chuyển khoản'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Discount Section */}
          <View style={styles.discountSection}>
            <Text style={styles.label}>Chiết khấu</Text>
            {customerId && maxDiscountEligible > 0 && (
              <Text style={styles.discountInfo}>
                Chiết khấu tối đa: {maxDiscountEligible.toLocaleString('vi-VN')}
                ₫
                {maxDiscountEligible > 0 && (
                  <Text style={styles.discountInfoSmall}>
                    {'\n'}(Khách hàng đã chi tiêu:{' '}
                    {customers
                      .find((c: any) => c._id === customerId)
                      ?.total_spent?.toLocaleString('vi-VN') || 0}
                    ₫)
                  </Text>
                )}
              </Text>
            )}
            {!customerId && (
              <Text style={styles.discountInfo}>
                Vui lòng chọn khách hàng để áp dụng chiết khấu
              </Text>
            )}
            {customerId && maxDiscountEligible === 0 && (
              <Text style={styles.discountInfo}>
                Khách hàng này chưa đủ điều kiện để nhận chiết khấu
              </Text>
            )}
            <TextInput
              style={[
                styles.input,
                discountError && styles.inputError, // Thêm style lỗi
              ]}
              placeholder="Nhập số tiền chiết khấu (tối thiểu 1,000₫)"
              value={discount.toString()}
              onChangeText={text => {
                const value = text.replace(/[^0-9]/g, '');
                const numValue = value ? parseInt(value, 10) : 0;
                setDiscount(numValue);

                // Validate real-time
                if (numValue > 0) {
                  const error = validateDiscount(numValue);
                  setDiscountError(error);
                } else {
                  setDiscountError(''); // Cho phép 0, không hiển thị lỗi
                }
              }}
              keyboardType="numeric"
              editable={!!customerId && maxDiscountEligible > 0}
            />
            {discountError ? (
              <Text style={styles.errorText}>{discountError}</Text>
            ) : null}
          </View>

          {/* Tax Rate Section */}
          <View style={styles.taxSection}>
            <Text style={styles.label}>Thuế suất (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập thuế suất (0-100)"
              value={taxRate.toString()}
              onChangeText={text => {
                const value = text.replace(/[^0-9.]/g, '');
                const numValue = value ? parseFloat(value) : 0;
                setTaxRate(numValue > 100 ? 100 : numValue);
              }}
              keyboardType="numeric"
              editable={!isPending}
            />
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
          {appliedDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Chiết khấu:</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{appliedDiscount.toLocaleString('vi-VN')}₫
              </Text>
            </View>
          )}
          {appliedTaxRate > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Tiền hàng sau chiết khấu:
                </Text>
                <Text style={styles.summaryValue}>
                  {(subtotal - appliedDiscount).toLocaleString('vi-VN')}₫
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Thuế ({appliedTaxRate}%):
                </Text>
                <Text style={styles.summaryValue}>
                  {taxAmount.toLocaleString('vi-VN')}₫
                </Text>
              </View>
            </>
          )}
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
                  <View style={styles.medicineListItemContent}>
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
  medicineListItemContent: {
    flex: 1,
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
  createCustomerButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E7F3FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0066CC',
    alignItems: 'center',
  },
  createCustomerButtonText: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '600',
  },
  barcodeScanButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#9C27B0',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
  },
  barcodeScanButtonText: {
    fontSize: 14,
    color: '#7B1FA2',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
  },
  discountSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  discountInfo: {
    fontSize: 12,
    color: '#0066CC',
    marginBottom: 8,
    fontWeight: '500',
  },
  discountInfoSmall: {
    fontSize: 11,
    color: '#666',
    fontWeight: '400',
  },
  taxSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  discountValue: {
    color: '#00AA44',
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default CreateInvoiceScreen;
