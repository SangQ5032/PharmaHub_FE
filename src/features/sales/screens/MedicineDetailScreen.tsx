import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetBatches } from '../hooks/useMedicines';
import { useAuthStore } from '../../auth/stores/useAuthStore';

const MedicineDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  const {
    medicine,
    onAddMedicine,
    batches: routeBatches,
    fromBarcodeScan,
  } = route.params || {};

  const [quantity, setQuantity] = useState('1');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchSearchQuery, setBatchSearchQuery] = useState('');

  const branchId = user?.branch_id || '';

  // ✅ Nếu batches được pass từ route (từ barcode scan), dùng luôn
  // Nếu không, mới fetch từ API
  const shouldFetchBatches = !routeBatches || routeBatches.length === 0;
  const { data: fetchedBatches = [], isLoading: batchesLoading } =
    useGetBatches(
      branchId,
      medicine?._id,
      shouldFetchBatches, // ✅ Chỉ fetch nếu cần thiết
    );

  // Sử dụng batches từ route nếu có, nếu không dùng batches được fetch
  const batches =
    routeBatches && routeBatches.length > 0 ? routeBatches : fetchedBatches;

  const price = String(medicine?.retail_price || medicine?.price || 0);

  const handleAddMedicine = () => {
    if (!quantity || Number(quantity) <= 0) {
      Alert.alert('Lỗi', 'Số lượng không hợp lệ');
      return;
    }

    if (!selectedBatch) {
      Alert.alert('Lỗi', 'Vui lòng chọn lô (batch)');
      return;
    }

    if (Number(quantity) > selectedBatch.quantity) {
      Alert.alert(
        'Lỗi',
        `Lô này chỉ còn ${selectedBatch.quantity}, không đủ ${quantity}`,
      );
      return;
    }

    if (!price || Number(price) < 0) {
      Alert.alert('Lỗi', 'Giá bán không hợp lệ');
      return;
    }

    // ✅ Gọi callback TRƯỚC Alert để callback execute (navigate về CreateInvoice)
    if (onAddMedicine) {
      onAddMedicine(
        medicine,
        Number(quantity),
        Number(price),
        selectedBatch._id,
      );
    }

    // Alert chỉ dùng để hiển thị thông báo
    // Nếu từ barcode scan, callback sẽ handle navigation
    // Nếu không, navigation.goBack() sẽ quay lại CreateInvoice
    Alert.alert('Thành công', 'Đã thêm thuốc vào đơn hàng', [
      {
        text: 'OK',
        onPress: () => {
          // Nếu không phải barcode scan, goBack về CreateInvoice
          if (!fromBarcodeScan) {
            navigation.goBack();
          }
          // Nếu là barcode scan, callback đã xử lý navigation rồi
        },
      },
    ]);
  };

  const handleQuantityChange = (newQuantity: string) => {
    const num = parseInt(newQuantity, 10) || 0;
    if (medicine.total_quantity && num > medicine.total_quantity) {
      setQuantity(String(medicine.total_quantity));
    } else if (num < 0) {
      setQuantity('0');
    } else {
      setQuantity(newQuantity);
    }
  };

  if (!medicine) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  const lineTotal = Number(quantity) * Number(price);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.medicineName}>{medicine.name}</Text>
        {medicine.generic_name && (
          <Text style={styles.genericName}>{medicine.generic_name}</Text>
        )}
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

        {medicine.brand_name && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nhãn hiệu:</Text>
            <Text style={styles.infoValue}>{medicine.brand_name}</Text>
          </View>
        )}

        {medicine.dosage_form && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dạng bào chế:</Text>
            <Text style={styles.infoValue}>{medicine.dosage_form}</Text>
          </View>
        )}

        {medicine.strength && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hàm lượng:</Text>
            <Text style={styles.infoValue}>{medicine.strength}</Text>
          </View>
        )}

        {medicine.unit && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đơn vị:</Text>
            <Text style={styles.infoValue}>{medicine.unit}</Text>
          </View>
        )}

        {medicine.packaging && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đóng gói:</Text>
            <Text style={styles.infoValue}>{medicine.packaging}</Text>
          </View>
        )}

        {medicine.manufacturer && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nhà sản xuất:</Text>
            <Text style={styles.infoValue}>{medicine.manufacturer}</Text>
          </View>
        )}

        {medicine.country_of_origin && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Xuất xứ:</Text>
            <Text style={styles.infoValue}>{medicine.country_of_origin}</Text>
          </View>
        )}

        {medicine.registration_number && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số đăng ký:</Text>
            <Text style={styles.infoValue}>{medicine.registration_number}</Text>
          </View>
        )}

        {medicine.barcode && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã vạch:</Text>
            <Text style={styles.infoValue}>{medicine.barcode}</Text>
          </View>
        )}
      </View>

      {/* Price & Stock Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giá & Tồn kho</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Giá bán lẻ:</Text>
          <Text style={styles.priceValue}>
            {Number(
              medicine.retail_price || medicine.price || 0,
            ).toLocaleString('vi-VN')}
            ₫
          </Text>
        </View>

        {medicine.minimum_price && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giá tối thiểu:</Text>
            <Text style={styles.infoValue}>
              {Number(medicine.minimum_price).toLocaleString('vi-VN')}₫
            </Text>
          </View>
        )}

        {medicine.max_price && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giá tối đa:</Text>
            <Text style={styles.infoValue}>
              {Number(medicine.max_price).toLocaleString('vi-VN')}₫
            </Text>
          </View>
        )}

        <View
          style={[
            styles.infoRow,
            medicine.total_quantity === 0 && styles.outOfStock,
          ]}
        >
          <Text style={styles.infoLabel}>Tồn kho:</Text>
          <Text
            style={[
              styles.infoValue,
              medicine.total_quantity === 0 && styles.outOfStockText,
            ]}
          >
            {medicine.total_quantity || 0} {medicine.unit || 'viên'}
          </Text>
        </View>

        {medicine.alert_threshold && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mức cảnh báo:</Text>
            <Text style={styles.infoValue}>{medicine.alert_threshold}</Text>
          </View>
        )}
      </View>

      {/* Medical Info */}
      {(medicine.indications ||
        medicine.contraindications ||
        medicine.side_effects ||
        medicine.usage_instructions) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin y học</Text>

          {medicine.indications && (
            <View style={styles.medicalInfoBlock}>
              <Text style={styles.medicalInfoLabel}>Chỉ định:</Text>
              <Text style={styles.medicalInfoText}>{medicine.indications}</Text>
            </View>
          )}

          {medicine.contraindications && (
            <View style={styles.medicalInfoBlock}>
              <Text style={styles.medicalInfoLabel}>Chống chỉ định:</Text>
              <Text style={styles.medicalInfoText}>
                {medicine.contraindications}
              </Text>
            </View>
          )}

          {medicine.side_effects && (
            <View style={styles.medicalInfoBlock}>
              <Text style={styles.medicalInfoLabel}>Tác dụng phụ:</Text>
              <Text style={styles.medicalInfoText}>
                {medicine.side_effects}
              </Text>
            </View>
          )}

          {medicine.usage_instructions && (
            <View style={styles.medicalInfoBlock}>
              <Text style={styles.medicalInfoLabel}>Hướng dẫn dùng:</Text>
              <Text style={styles.medicalInfoText}>
                {medicine.usage_instructions}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Storage Info */}
      {medicine.storage_conditions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo quản</Text>
          <Text style={styles.storageText}>{medicine.storage_conditions}</Text>
        </View>
      )}

      {/* Batches Info */}
      {medicine.batches && medicine.batches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thông tin lô ({medicine.batches.length})
          </Text>

          {medicine.batches.map((batch: any, index: number) => (
            <View key={batch._id} style={styles.batchCard}>
              <View style={styles.batchHeader}>
                <Text style={styles.batchNumber}>Lô {index + 1}</Text>
                <Text style={styles.batchNumberValue}>
                  {batch.batch_number}
                </Text>
              </View>

              <View style={styles.batchInfo}>
                <View style={styles.batchRow}>
                  <Text style={styles.batchLabel}>Số lô:</Text>
                  <Text style={styles.batchValue}>{batch.batch_number}</Text>
                </View>

                <View style={styles.batchRow}>
                  <Text style={styles.batchLabel}>Hạn dùng:</Text>
                  <Text style={styles.batchValue}>
                    {new Date(batch.expiry_date).toLocaleDateString('vi-VN')}
                  </Text>
                </View>

                <View style={styles.batchRow}>
                  <Text style={styles.batchLabel}>Số lượng:</Text>
                  <Text style={styles.batchValue}>{batch.quantity}</Text>
                </View>

                <View style={styles.batchRow}>
                  <Text style={styles.batchLabel}>Giá nhập:</Text>
                  <Text style={styles.batchValue}>
                    {Number(batch.import_price).toLocaleString('vi-VN')}₫
                  </Text>
                </View>

                {batch.supplier_name && (
                  <View style={styles.batchRow}>
                    <Text style={styles.batchLabel}>Nhà cung cấp:</Text>
                    <Text style={styles.batchValue}>{batch.supplier_name}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Add to Invoice Section */}
      <View style={styles.addSection}>
        <Text style={styles.addSectionTitle}>Thêm vào đơn hàng</Text>

        {/* Batch Selection */}
        <View style={styles.batchSelectionContainer}>
          <Text style={styles.label}>Lô (Batch) *</Text>
          {batchesLoading ? (
            <ActivityIndicator size="small" color="#0066CC" />
          ) : (
            <TouchableOpacity
              style={[
                styles.batchSelectButton,
                !selectedBatch && styles.batchSelectButtonEmpty,
              ]}
              onPress={() => setShowBatchModal(true)}
              disabled={batches.length === 0}
            >
              <Text
                style={[
                  styles.batchSelectButtonText,
                  !selectedBatch && styles.batchSelectButtonEmptyText,
                ]}
              >
                {selectedBatch
                  ? `${selectedBatch.batch_number} (HSD: ${new Date(
                      selectedBatch.expiry_date,
                    ).toLocaleDateString('vi-VN')}, Còn: ${
                      selectedBatch.quantity
                    })`
                  : batches.length === 0
                  ? 'Không có lô nào'
                  : 'Chọn lô hàng...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.quantityPriceRow}>
          <View style={[styles.inputContainer, styles.quantityInputContainer]}>
            <Text style={styles.label}>Số lượng</Text>
            <View style={styles.quantityControlContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleQuantityChange(
                    String(Math.max(0, Number(quantity) - 1)),
                  )
                }
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityDisplay}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleQuantityChange(String(Number(quantity) + 1))
                }
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            {selectedBatch && (
              <Text style={styles.quantityNote}>
                Lô còn: {selectedBatch.quantity}
              </Text>
            )}
          </View>

          <View style={[styles.inputContainer, styles.priceInputContainer]}>
            <Text style={styles.label}>Giá bán (₫)</Text>
            <Text style={styles.priceDisplay}>
              {Number(price).toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>

        <View style={styles.lineTotalRow}>
          <Text style={styles.lineTotalLabel}>Thành tiền:</Text>
          <Text style={styles.lineTotalValue}>
            {lineTotal.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addButton, !selectedBatch && styles.addButtonDisabled]}
          onPress={handleAddMedicine}
          disabled={!selectedBatch || batches.length === 0}
        >
          <Text style={styles.addButtonText}>Thêm vào đơn hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Batch Selection Modal */}
      <Modal
        visible={showBatchModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBatchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn lô hàng</Text>
              <TouchableOpacity onPress={() => setShowBatchModal(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm lô (mã lô, HSD)..."
              value={batchSearchQuery}
              onChangeText={setBatchSearchQuery}
            />

            <FlatList
              data={batches.filter((batch: any) =>
                batch.batch_number
                  .toLowerCase()
                  .includes(batchSearchQuery.toLowerCase()),
              )}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.batchListItem,
                    selectedBatch?._id === item._id &&
                      styles.batchListItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedBatch(item);
                    setShowBatchModal(false);
                    setBatchSearchQuery('');
                  }}
                >
                  <View>
                    <Text style={styles.batchListBatchNumber}>
                      Lô: {item.batch_number}
                    </Text>
                    <Text style={styles.batchListInfo}>
                      HSD:{' '}
                      {new Date(item.expiry_date).toLocaleDateString('vi-VN')} |
                      Còn: {item.quantity}
                    </Text>
                    <Text style={styles.batchListInfo}>
                      Giá nhập:{' '}
                      {Number(item.import_price).toLocaleString('vi-VN')}₫
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không tìm thấy lô nào</Text>
              }
            />
          </View>
        </View>
      </Modal>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

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
  medicineName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  genericName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  outOfStock: {
    backgroundColor: '#FFF3CD',
  },
  outOfStockText: {
    color: '#DC3545',
    fontWeight: '700',
  },
  medicalInfoBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  medicalInfoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 6,
  },
  medicalInfoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  storageText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  batchCard: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  batchNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  batchNumberValue: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '600',
  },
  batchInfo: {
    gap: 8,
  },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  batchLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  batchValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  addSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
  },
  addSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  quantityInputContainer: {
    flex: 1,
  },
  priceInputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  quantityControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  quantityDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
  quantityNote: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  priceDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
  },
  lineTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  lineTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  lineTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066CC',
  },
  addButton: {
    backgroundColor: '#00AA44',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  batchSelectionContainer: {
    marginBottom: 16,
  },
  batchSelectButton: {
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#F0F8FF',
  },
  batchSelectButtonEmpty: {
    borderColor: '#DDD',
    backgroundColor: '#F9F9F9',
  },
  batchSelectButtonText: {
    fontSize: 13,
    color: '#0066CC',
    fontWeight: '500',
  },
  batchSelectButtonEmptyText: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: 20,
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
    color: '#0066CC',
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 10,
    margin: 12,
    fontSize: 14,
    color: '#333',
  },
  batchListItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  batchListItemSelected: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
  },
  batchListBatchNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  batchListInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    height: 20,
  },
});

export default MedicineDetailScreen;
