import React, { useState, useMemo } from 'react';
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
import { useGetBatches, useMedicineDetail } from '../hooks/useMedicines';
import { useAuthStore } from '../../auth/stores/useAuthStore';

const MedicineDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuthStore();
  const {
    medicine: medicineFromParams,
    onAddMedicine,
    batches: routeBatches,
    fromBarcodeScan,
  } = route.params || {};

  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState<
    'box' | 'blister' | 'tablet'
  >('tablet');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchSearchQuery, setBatchSearchQuery] = useState('');

  const branchId = user?.branch_id || '';
  const medicineId = medicineFromParams?._id;

  // ✅ Gọi API để lấy thông tin thuốc mới nhất
  const {
    data: medicineFromAPI,
    isLoading: medicineLoading,
    error: medicineError,
  } = useMedicineDetail(medicineId, !!medicineId);

  // ✅ Sử dụng dữ liệu từ API nếu có, fallback về route params
  const medicine = medicineFromAPI || medicineFromParams;

  // ✅ Nếu batches được pass từ route (từ barcode scan), dùng luôn
  // Nếu không, mới fetch từ API
  const shouldFetchBatches = !routeBatches || routeBatches.length === 0;
  const { data: fetchedBatches = [], isLoading: batchesLoading } =
    useGetBatches(
      branchId,
      medicine?._id,
      shouldFetchBatches && !!medicine?._id, // ✅ Chỉ fetch nếu cần thiết và có medicine ID
    );

  // Sử dụng batches từ route nếu có, nếu không dùng batches được fetch
  const batches =
    routeBatches && routeBatches.length > 0 ? routeBatches : fetchedBatches;

  // ✅ Tính tổng tồn kho từ batches (tính bằng base_unit)
  const totalQuantityFromBatches = useMemo(() => {
    if (!batches || batches.length === 0) return 0;
    return batches.reduce((sum: number, batch: any) => {
      return sum + (batch.quantity || 0);
    }, 0);
  }, [batches]);

  // ✅ Kết hợp thông tin: sử dụng total_quantity từ batches nếu có, fallback về medicine.total_quantity
  const totalQuantity =
    totalQuantityFromBatches || medicine?.total_quantity || 0;

  // ✅ Kiểm tra đơn vị nào có thể chọn được dựa trên số lượng tồn kho
  const isUnitAvailable = useMemo(() => {
    if (!medicine?.units || !Array.isArray(medicine.units)) {
      // Fallback: nếu không có units array, cho phép tất cả
      return {
        box: totalQuantity >= 100,
        blister: totalQuantity >= 10,
        tablet: totalQuantity > 0,
      };
    }

    const availability: Record<string, boolean> = {};

    medicine.units.forEach((unitData: any) => {
      const unit = unitData.unit;
      const multiplier = unitData.multiplier || 1;

      // Kiểm tra xem có đủ số lượng để bán ít nhất 1 đơn vị
      availability[unit] = totalQuantity >= multiplier;
    });

    return availability;
  }, [medicine?.units, totalQuantity]);

  // ✅ Tự động chuyển đơn vị nếu đơn vị hiện tại không còn đủ số lượng
  React.useEffect(() => {
    if (selectedUnit && isUnitAvailable[selectedUnit] === false) {
      // Tìm đơn vị có sẵn đầu tiên (ưu tiên: tablet > blister > box)
      const priorityOrder = ['tablet', 'blister', 'box'];
      const availableUnit = priorityOrder.find(
        unit => isUnitAvailable[unit] === true,
      );

      if (availableUnit) {
        setSelectedUnit(availableUnit as 'box' | 'blister' | 'tablet');
      }
    }
  }, [isUnitAvailable, selectedUnit]);

  // ✅ Get price based on selected unit từ units array trong medicine response
  const getUnitPrice = () => {
    // Ưu tiên lấy từ units array trong medicine response
    if (medicine?.units && Array.isArray(medicine.units)) {
      const unitData = medicine.units.find((u: any) => u.unit === selectedUnit);
      if (unitData?.price) {
        return unitData.price;
      }
    }

    // Fallback về prices object
    if (medicine?.prices?.price_per_unit?.[selectedUnit]) {
      return medicine.prices.price_per_unit[selectedUnit];
    }
    if (medicine?.prices?.unit_prices?.[selectedUnit]) {
      return medicine.prices.unit_prices[selectedUnit];
    }

    // Fallback to retail_price for tablet
    if (selectedUnit === 'tablet') {
      return medicine?.retail_price || medicine?.price || 0;
    }
    return 0;
  };

  const price = getUnitPrice();

  // ✅ Lấy base_unit từ medicine response
  const baseUnit = medicine?.base_unit || medicine?.unit || 'viên';

  // ✅ Lấy multiplier của đơn vị đã chọn
  const getUnitMultiplier = () => {
    if (medicine?.units && Array.isArray(medicine.units)) {
      const unitData = medicine.units.find((u: any) => u.unit === selectedUnit);
      if (unitData?.multiplier) {
        return unitData.multiplier;
      }
    }

    // Fallback: giá trị mặc định nếu không tìm thấy
    if (selectedUnit === 'box') return 100;
    if (selectedUnit === 'blister') return 10;
    return 1; // tablet
  };

  const handleAddMedicine = () => {
    if (!quantity || Number(quantity) <= 0) {
      Alert.alert('Lỗi', 'Số lượng không hợp lệ');
      return;
    }

    if (!price || Number(price) < 0) {
      Alert.alert('Lỗi', 'Giá bán không hợp lệ');
      return;
    }

    // ✅ Với role employee, bắt buộc phải chọn batch
    if (user?.role === 'employee') {
      if (!selectedBatch) {
        Alert.alert(
          'Lỗi',
          'Vui lòng chọn lô thuốc trước khi thêm vào đơn hàng',
        );
        return;
      }
    }

    // ✅ Kiểm tra số lượng tồn kho với đơn vị đã chọn
    const unitMultiplier = getUnitMultiplier();
    const requestedQuantityInBaseUnit = Number(quantity) * unitMultiplier;

    // Nếu đã chọn batch (employee), kiểm tra số lượng của batch đó
    // Nếu không, kiểm tra tổng tồn kho
    const availableQuantity = selectedBatch?.quantity || totalQuantity;
    const quantitySource = selectedBatch ? 'lô đã chọn' : 'tổng tồn kho';

    if (requestedQuantityInBaseUnit > availableQuantity) {
      const unitName =
        selectedUnit === 'box'
          ? 'hộp'
          : selectedUnit === 'blister'
          ? 'vỉ'
          : 'viên';
      const batchInfo = selectedBatch
        ? `\nLô: ${selectedBatch.batch_number}\n`
        : '';
      Alert.alert(
        'Lỗi',
        `Số lượng tồn kho không đủ!\n\n` +
          `Bạn muốn mua: ${Number(
            quantity,
          )} ${unitName} (${requestedQuantityInBaseUnit} ${baseUnit})` +
          batchInfo +
          `${
            quantitySource.charAt(0).toUpperCase() + quantitySource.slice(1)
          }: ${availableQuantity} ${baseUnit}\n` +
          `Thiếu: ${
            requestedQuantityInBaseUnit - availableQuantity
          } ${baseUnit}`,
      );
      return;
    }

    // ✅ Gọi callback TRƯỚC Alert để callback execute (navigate về CreateInvoice)
    if (onAddMedicine) {
      onAddMedicine(
        medicine,
        Number(quantity),
        selectedUnit,
        price,
        selectedBatch?._id, // Truyền batch_id nếu có
        selectedBatch?.batch_number, // Truyền batch_number để hiển thị
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
    if (totalQuantity && num > totalQuantity) {
      setQuantity(String(totalQuantity));
    } else if (num < 0) {
      setQuantity('0');
    } else {
      setQuantity(newQuantity);
    }
  };

  // Hiển thị loading khi đang fetch dữ liệu từ API
  if (medicineLoading && !medicineFromParams) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Đang tải thông tin thuốc...</Text>
      </View>
    );
  }

  // Hiển thị lỗi nếu không có dữ liệu
  if (!medicine) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {medicineError
              ? 'Không thể tải thông tin thuốc'
              : 'Không tìm thấy thông tin thuốc'}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
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

        {(medicine.base_unit || medicine.unit) && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đơn vị cơ bản:</Text>
            <Text style={styles.infoValue}>
              {medicine.base_unit || medicine.unit}
            </Text>
          </View>
        )}

        {medicine.units &&
          Array.isArray(medicine.units) &&
          medicine.units.length > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Đơn vị bán:</Text>
              <View style={styles.unitsInfoContainer}>
                {medicine.units.map((unit: any, index: number) => (
                  <Text key={index} style={styles.unitsInfoText}>
                    {unit.unit === 'box'
                      ? 'Hộp'
                      : unit.unit === 'blister'
                      ? 'Vỉ'
                      : 'Viên'}
                    : {unit.multiplier} {baseUnit} ={' '}
                    {Number(unit.price || 0).toLocaleString('vi-VN')}₫
                  </Text>
                ))}
              </View>
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

        {/* Hiển thị giá theo từng đơn vị */}
        {medicine.units &&
        Array.isArray(medicine.units) &&
        medicine.units.length > 0 ? (
          medicine.units.map((unit: any, index: number) => (
            <View key={index} style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Giá bán (
                {unit.unit === 'box'
                  ? 'Hộp'
                  : unit.unit === 'blister'
                  ? 'Vỉ'
                  : 'Viên'}
                ):
              </Text>
              <Text style={styles.priceValue}>
                {Number(unit.price || 0).toLocaleString('vi-VN')}₫
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Giá bán lẻ:</Text>
            <Text style={styles.priceValue}>
              {Number(
                medicine.retail_price || medicine.price || 0,
              ).toLocaleString('vi-VN')}
              ₫
            </Text>
          </View>
        )}

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

        {/* ✅ Tồn kho tính từ batches */}
        <View
          style={[styles.infoRow, totalQuantity === 0 && styles.outOfStock]}
        >
          <Text style={styles.infoLabel}>Tồn kho:</Text>
          <Text
            style={[
              styles.infoValue,
              totalQuantity === 0 && styles.outOfStockText,
            ]}
          >
            {totalQuantity} {baseUnit}
            {batches && batches.length > 0 && (
              <Text style={styles.batchCountText}> ({batches.length} lô)</Text>
            )}
          </Text>
        </View>

        {medicine.alert_threshold && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mức cảnh báo:</Text>
            <Text style={styles.infoValue}>
              {medicine.alert_threshold} {baseUnit}
            </Text>
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

      {/* Batches Info - Hiển thị từ batches API response */}
      {batches && batches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Thông tin lô ({batches.length})
          </Text>

          {batches.map((batch: any, index: number) => (
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
                  <Text style={styles.batchValue}>
                    {batch.quantity} {baseUnit}
                  </Text>
                </View>

                {batch.import_price !== undefined && (
                  <View style={styles.batchRow}>
                    <Text style={styles.batchLabel}>Giá nhập:</Text>
                    <Text style={styles.batchValue}>
                      {Number(batch.import_price).toLocaleString('vi-VN')}₫
                    </Text>
                  </View>
                )}

                {batch.supplier_name && (
                  <View style={styles.batchRow}>
                    <Text style={styles.batchLabel}>Nhà cung cấp:</Text>
                    <Text style={styles.batchValue}>{batch.supplier_name}</Text>
                  </View>
                )}

                {batch.status && (
                  <View style={styles.batchRow}>
                    <Text style={styles.batchLabel}>Trạng thái:</Text>
                    <Text
                      style={[
                        styles.batchValue,
                        batch.status === 'active' && styles.activeStatus,
                      ]}
                    >
                      {batch.status === 'active' ? 'Hoạt động' : batch.status}
                    </Text>
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

        {/* Unit Selection */}
        <View style={styles.unitSelectionContainer}>
          <Text style={styles.label}>Đơn vị *</Text>
          <View style={styles.unitSelector}>
            {/* Hiển thị các đơn vị từ units array trong medicine response */}
            {medicine?.units &&
            Array.isArray(medicine.units) &&
            medicine.units.length > 0
              ? medicine.units.map((unitData: any) => {
                  const unit = unitData.unit as 'box' | 'blister' | 'tablet';
                  const isAvailable = isUnitAvailable[unit] === true;

                  // Chỉ hiển thị button nếu đơn vị có sẵn
                  if (!isAvailable) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        selectedUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setSelectedUnit(unit)}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          selectedUnit === unit && styles.unitButtonTextActive,
                        ]}
                      >
                        {unit === 'box'
                          ? 'Hộp'
                          : unit === 'blister'
                          ? 'Vỉ'
                          : 'Viên'}
                      </Text>
                      {unitData.price && (
                        <Text
                          style={[
                            styles.unitPriceText,
                            selectedUnit === unit && styles.unitPriceTextActive,
                          ]}
                        >
                          {Number(unitData.price).toLocaleString('vi-VN')}₫
                        </Text>
                      )}
                      {unitData.multiplier && (
                        <Text
                          style={[
                            styles.unitMultiplierText,
                            selectedUnit === unit &&
                              styles.unitMultiplierTextActive,
                          ]}
                        >
                          ({unitData.multiplier} {baseUnit})
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })
              : // Fallback: hiển thị các đơn vị mặc định
                (['box', 'blister', 'tablet'] as const).map(unit => {
                  const isAvailable = isUnitAvailable[unit] === true;

                  // Chỉ hiển thị button nếu đơn vị có sẵn
                  if (!isAvailable) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        styles.unitButton,
                        selectedUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setSelectedUnit(unit)}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          selectedUnit === unit && styles.unitButtonTextActive,
                        ]}
                      >
                        {unit === 'box'
                          ? 'Hộp'
                          : unit === 'blister'
                          ? 'Vỉ'
                          : 'Viên'}
                      </Text>
                      {medicine?.prices?.price_per_unit?.[unit] && (
                        <Text
                          style={[
                            styles.unitPriceText,
                            selectedUnit === unit && styles.unitPriceTextActive,
                          ]}
                        >
                          {Number(
                            medicine.prices.price_per_unit[unit],
                          ).toLocaleString('vi-VN')}
                          ₫
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
          </View>
          {/* Hiển thị thông báo cho các đơn vị không đủ số lượng */}
          {(() => {
            const unavailableUnits: string[] = [];

            if (
              medicine?.units &&
              Array.isArray(medicine.units) &&
              medicine.units.length > 0
            ) {
              // Trường hợp có units array
              medicine.units.forEach((unitData: any) => {
                const unit = unitData.unit;
                if (isUnitAvailable[unit] === false) {
                  unavailableUnits.push(
                    unit === 'box' ? 'Hộp' : unit === 'blister' ? 'Vỉ' : 'Viên',
                  );
                }
              });
            } else {
              // Trường hợp fallback (không có units array)
              (['box', 'blister', 'tablet'] as const).forEach(unit => {
                if (isUnitAvailable[unit] === false) {
                  unavailableUnits.push(
                    unit === 'box' ? 'Hộp' : unit === 'blister' ? 'Vỉ' : 'Viên',
                  );
                }
              });
            }

            if (unavailableUnits.length > 0) {
              return (
                <Text style={styles.unavailableUnitText}>
                  ⚠️ {unavailableUnits.join(', ')}: Số lượng không đủ
                </Text>
              );
            }
            return null;
          })()}
        </View>

        {/* Batch Selection - Chỉ hiển thị cho employee role */}
        {user?.role === 'employee' && batches.length > 0 && (
          <View style={styles.batchSelectionContainer}>
            <Text style={styles.label}>Chọn lô thuốc *</Text>
            <TouchableOpacity
              style={[
                styles.batchSelectButton,
                !selectedBatch && styles.batchSelectButtonEmpty,
              ]}
              onPress={() => setShowBatchModal(true)}
            >
              <Text
                style={[
                  styles.batchSelectButtonText,
                  !selectedBatch && styles.batchSelectButtonEmptyText,
                ]}
              >
                {selectedBatch
                  ? `Lô: ${selectedBatch.batch_number} | HSD: ${new Date(
                      selectedBatch.expiry_date,
                    ).toLocaleDateString('vi-VN')} | Còn: ${
                      selectedBatch.quantity
                    }`
                  : 'Chọn lô thuốc'}
              </Text>
            </TouchableOpacity>
            {selectedBatch && (
              <TouchableOpacity
                style={styles.changeBatchButton}
                onPress={() => setSelectedBatch(null)}
              >
                <Text style={styles.changeBatchButtonText}>Thay đổi lô</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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
            <Text style={styles.quantityNote}>
              {selectedUnit === 'box'
                ? 'Hộp'
                : selectedUnit === 'blister'
                ? 'Vỉ'
                : 'Viên'}
            </Text>
          </View>

          <View style={[styles.inputContainer, styles.priceInputContainer]}>
            <Text style={styles.label}>
              Giá bán (₫/
              {selectedUnit === 'box'
                ? 'hộp'
                : selectedUnit === 'blister'
                ? 'vỉ'
                : 'viên'}
              )
            </Text>
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

        <TouchableOpacity style={styles.addButton} onPress={handleAddMedicine}>
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
  unitSelectionContainer: {
    marginBottom: 16,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  unitButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  unitButtonActive: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  unitButtonTextActive: {
    color: '#FFF',
  },
  unitPriceText: {
    fontSize: 11,
    color: '#999',
  },
  unitPriceTextActive: {
    color: '#FFF',
  },
  unitMultiplierText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  unitMultiplierTextActive: {
    color: '#FFF',
  },
  unitsInfoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  unitsInfoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  batchCountText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  activeStatus: {
    color: '#00AA44',
    fontWeight: '600',
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
  changeBatchButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFC107',
    alignItems: 'center',
  },
  changeBatchButtonText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableUnitText: {
    fontSize: 12,
    color: '#DC3545',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default MedicineDetailScreen;
