/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
  Modal,
} from 'react-native';
import { createMedicine, updateMedicine } from '../services/medicineService';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { Medicine } from '../types';
import { ROUTES } from '@shared/constants/routes';
import useCategories from '../../categories/hooks/useCategories';
import { Category } from '../../categories/types';
import { FlatList } from 'react-native';
import { useCallback } from 'react';
import { deleteCategory } from '../../categories/services/categoriesService';
import {
  getValidUnits,
  getUnitDisplayName,
} from '../../../utils/medicineUnits';

const AddMedicineScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mode = route?.params?.mode ?? 'create';
  const editingItem: Medicine | null = route?.params?.item ?? null;

  // Form fields
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [strength, setStrength] = useState('');
  const [packaging, setPackaging] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [isControlled, setIsControlled] = useState(false);
  const [baseUnit, setBaseUnit] = useState('tablet');
  const [units, setUnits] = useState<any[]>([
    { unit: 'tablet', multiplier: 1, price: '' },
    { unit: 'blister', multiplier: 10, price: '' },
    { unit: 'box', multiplier: 100, price: '' },
  ]);
  const [packageStructure, setPackageStructure] = useState<any>(null);
  const [autoGenerateStructure, setAutoGenerateStructure] = useState(true);
  const [manufacturer, setManufacturer] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [indications, setIndications] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [storageConditions, setStorageConditions] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  // Categories hook
  const {
    items: categories,
    loading: categoriesLoading,
    search: categorySearch,
    setSearch: setCategorySearch,
    refresh: refreshCategories,
  } = useCategories({
    initialPage: 1,
    initialLimit: 100,
  });

  // Refresh categories when screen is focused (e.g., after creating a new category)
  useFocusEffect(
    useCallback(() => {
      refreshCategories();
    }, [refreshCategories]),
  );

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setName(editingItem.name ?? '');
      setGenericName(editingItem.generic_name ?? '');
      setBrandName(editingItem.brand_name ?? '');
      setDosageForm(editingItem.dosage_form ?? '');
      setStrength(editingItem.strength ?? '');
      setPackaging(editingItem.packaging ?? '');
      setCategoryId(editingItem.category_id?._id ?? '');
      setCategoryName(editingItem.category_id?.name ?? '');
      setPrescriptionRequired(editingItem.prescription_required ?? false);
      setIsControlled(editingItem.is_controlled ?? false);
      setBaseUnit(editingItem.base_unit ?? 'tablet');
      // Load units from editing item
      const existingUnits = editingItem.units ?? [];
      let loadedUnits: any[] = [];

      if (existingUnits.length > 0) {
        // Map existing units - giữ nguyên tên đơn vị từ dữ liệu
        loadedUnits = existingUnits.map((u: any) => ({
          unit: u.unit || '',
          multiplier: u.multiplier || 1,
          price: String(u.price || ''),
        }));
      } else {
        // Nếu không có units, tạo từ prices hoặc dùng mặc định
        const prices = (editingItem as any).prices;
        if (prices && prices.price_per_unit) {
          // Thêm base unit
          if (prices.base_unit_price) {
            loadedUnits.push({
              unit: editingItem.base_unit || 'tablet',
              multiplier: 1,
              price: String(prices.base_unit_price),
            });
          }
          // Thêm các đơn vị khác từ price_per_unit
          Object.entries(prices.price_per_unit).forEach(
            ([unit, price]: [string, any]) => {
              if (price && unit !== (editingItem.base_unit || 'tablet')) {
                // Tính multiplier từ package_structure nếu có
                const structure = (editingItem as any).package_structure;
                let multiplier = 1;
                if (structure && structure[unit]) {
                  // Tính multiplier từ structure
                  let currentUnit = unit;
                  multiplier = 1;
                  while (
                    structure[currentUnit] &&
                    structure[currentUnit].child
                  ) {
                    multiplier *= structure[currentUnit].contains;
                    currentUnit = structure[currentUnit].child;
                  }
                }
                loadedUnits.push({
                  unit: unit,
                  multiplier: multiplier,
                  price: String(price),
                });
              }
            },
          );
        }

        if (loadedUnits.length === 0) {
          loadedUnits = [
            { unit: 'tablet', multiplier: 1, price: '' },
            { unit: 'blister', multiplier: 10, price: '' },
            { unit: 'box', multiplier: 100, price: '' },
          ];
        }
      }

      setUnits(loadedUnits);

      // Load package_structure từ editing item
      const existingStructure = (editingItem as any).package_structure;
      if (existingStructure && Object.keys(existingStructure).length > 0) {
        setPackageStructure(existingStructure);
        setAutoGenerateStructure(false);
      } else {
        // Nếu không có, tự động tạo từ units
        setAutoGenerateStructure(true);
        generatePackageStructure(loadedUnits);
      }
      setManufacturer(editingItem.manufacturer ?? '');
      setCountryOfOrigin(editingItem.country_of_origin ?? '');
      setIndications(editingItem.indications ?? '');
      setContraindications(editingItem.contraindications ?? '');
      setSideEffects(editingItem.side_effects ?? '');
      setUsageInstructions(editingItem.usage_instructions ?? '');
      setStorageConditions(editingItem.storage_conditions ?? '');
      setRegistrationNumber(editingItem.registration_number ?? '');
      setBarcode(editingItem.barcode ?? '');
      setAlertThreshold(
        editingItem.alert_threshold != null
          ? String(editingItem.alert_threshold)
          : '',
      );
      setStatus(editingItem.status ?? 'active');
    }
  }, [mode, editingItem]);

  const validate = () => {
    if (!name.trim()) return 'Tên thuốc là bắt buộc';
    if (!genericName.trim()) return 'Hoạt chất là bắt buộc';
    if (!baseUnit.trim()) return 'Đơn vị cơ bản là bắt buộc';
    // Check if at least one unit has price
    const hasPrice = units.some(u => u.price && Number(u.price) > 0);
    if (!hasPrice) return 'Phải nhập giá cho ít nhất một đơn vị';
    return null;
  };

  const handleUnitPriceChange = (index: number, price: string) => {
    const updated = [...units];
    updated[index] = { ...updated[index], price: price };
    setUnits(updated);
    // Tự động tạo lại package_structure nếu bật auto
    if (autoGenerateStructure) {
      generatePackageStructure(updated);
    }
  };

  const handleUnitMultiplierChange = (index: number, multiplier: string) => {
    const updated = [...units];
    // Cho phép nhập số bất kỳ > 0
    // Lọc chỉ lấy số từ input để tránh ký tự không hợp lệ
    const trimmed = multiplier.trim();

    if (trimmed === '') {
      // Khi xóa hết, cho phép rỗng tạm thời (không reset về 1 ngay)
      // Sẽ validate khi blur
      updated[index] = { ...updated[index], multiplier: 0 }; // Dùng 0 làm flag cho empty
    } else {
      // Lọc chỉ lấy số (bao gồm số thập phân)
      const numericOnly = trimmed.replace(/[^\d.]/g, '');
      if (numericOnly === '') {
        // Không còn số nào, cho phép rỗng tạm thời
        updated[index] = { ...updated[index], multiplier: 0 };
      } else {
        const parsed = Number(numericOnly);
        // Cho phép nhập số bất kỳ > 0
        if (!isNaN(parsed) && parsed > 0) {
          updated[index] = { ...updated[index], multiplier: parsed };
        } else {
          // Nếu <= 0, giữ giá trị cũ
          return;
        }
      }
    }

    setUnits(updated);
    // Tự động tạo lại package_structure nếu bật auto
    if (autoGenerateStructure) {
      generatePackageStructure(updated);
    }
  };

  // Validate và set giá trị mặc định khi blur
  const handleUnitMultiplierBlur = (index: number) => {
    const updated = [...units];
    if (updated[index].multiplier === 0 || updated[index].multiplier <= 0) {
      // Nếu rỗng hoặc <= 0, set về 1
      updated[index] = { ...updated[index], multiplier: 1 };
      setUnits(updated);
      if (autoGenerateStructure) {
        generatePackageStructure(updated);
      }
    }
  };

  // Tự động tạo package_structure từ units array
  const generatePackageStructure = (unitsArray: any[]) => {
    if (!unitsArray || unitsArray.length === 0) {
      setPackageStructure(null);
      return;
    }

    // Lọc bỏ các unit có multiplier <= 0 (đang nhập)
    const validUnits = unitsArray.filter(u => u.multiplier > 0);
    if (validUnits.length === 0) {
      setPackageStructure(null);
      return;
    }

    // Sắp xếp units theo multiplier (từ nhỏ đến lớn)
    const sortedUnits = [...validUnits].sort(
      (a, b) => a.multiplier - b.multiplier,
    );

    // Tìm base unit (multiplier = 1)
    const baseUnitItem = sortedUnits.find(u => u.multiplier === 1);
    if (!baseUnitItem) {
      setPackageStructure(null);
      return;
    }

    const structure: any = {};

    // Base unit luôn có contains: 1, child: null
    structure[baseUnitItem.unit] = {
      contains: 1,
      child: null,
    };

    // Xây dựng cấu trúc từ base unit lên
    let currentUnit = baseUnitItem;
    for (let i = 1; i < sortedUnits.length; i++) {
      const nextUnit = sortedUnits[i];
      const contains = nextUnit.multiplier / currentUnit.multiplier;

      structure[nextUnit.unit] = {
        contains: Math.round(contains),
        child: currentUnit.unit,
      };

      currentUnit = nextUnit;
    }

    setPackageStructure(structure);
  };

  // Thêm đơn vị mới
  const handleAddUnit = () => {
    const newUnit = { unit: '', multiplier: 1, price: '' };
    setUnits([...units, newUnit]);
  };

  // Xóa đơn vị
  const handleRemoveUnit = (index: number) => {
    if (units.length <= 1) {
      Alert.alert('Lỗi', 'Phải có ít nhất một đơn vị');
      return;
    }
    const updated = units.filter((_, i) => i !== index);
    setUnits(updated);
    if (autoGenerateStructure) {
      generatePackageStructure(updated);
    }
  };

  // Cập nhật tên đơn vị
  const handleUnitNameChange = (index: number, unitName: string) => {
    const updated = [...units];
    updated[index] = { ...updated[index], unit: unitName };
    setUnits(updated);
    if (autoGenerateStructure) {
      generatePackageStructure(updated);
    }
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Lỗi', err);
      return;
    }

    const payload: any = {
      name: name.trim(),
      generic_name: genericName.trim(),
      brand_name: brandName.trim() || undefined,
      dosage_form: dosageForm.trim() || undefined,
      strength: strength.trim() || undefined,
      base_unit: baseUnit.trim(),
      packaging: packaging.trim() || undefined,
      units: units
        .filter(u => u.price && Number(u.price) > 0)
        .map(u => ({
          unit: u.unit,
          multiplier: u.multiplier,
          price: Number(u.price),
        })),
      package_structure: packageStructure,
      category_id: categoryId.trim() || undefined,
      prescription_required: prescriptionRequired,
      is_controlled: isControlled,
      manufacturer: manufacturer.trim() || undefined,
      country_of_origin: countryOfOrigin.trim() || undefined,
      indications: indications.trim() || undefined,
      contraindications: contraindications.trim() || undefined,
      side_effects: sideEffects.trim() || undefined,
      usage_instructions: usageInstructions.trim() || undefined,
      storage_conditions: storageConditions.trim() || undefined,
      registration_number: registrationNumber.trim() || undefined,
      barcode: barcode.trim() || undefined,
      alert_threshold: alertThreshold ? Number(alertThreshold) : undefined,
      status: status,
    };

    setSubmitting(true);
    try {
      if (mode === 'edit' && editingItem) {
        await updateMedicine(String(editingItem._id), payload);
        Alert.alert('Thành công', 'Đã cập nhật thuốc', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createMedicine(payload);
        Alert.alert('Thành công', 'Tạo thuốc thành công', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to medicine list and reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.MEDICINES }],
              });
            },
          },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Lỗi khi lưu', e?.message ?? String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'edit' ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Section 1: Thông tin cơ bản */}
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

        <Text style={styles.label}>Tên thuốc *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="VD: Paracetamol"
        />

        <Text style={styles.label}>Hoạt chất (Generic Name) *</Text>
        <TextInput
          style={styles.input}
          value={genericName}
          onChangeText={setGenericName}
          placeholder="VD: Acetaminophen"
        />

        <Text style={styles.label}>Tên thương mại (Brand Name)</Text>
        <TextInput
          style={styles.input}
          value={brandName}
          onChangeText={setBrandName}
          placeholder="VD: Tylenol"
        />

        <Text style={styles.label}>Dạng liều</Text>
        <TextInput
          style={styles.input}
          value={dosageForm}
          onChangeText={setDosageForm}
          placeholder="VD: Viên nén, Viên nang"
        />

        <View style={styles.rowHalf}>
          <View style={styles.halfContainer}>
            <Text style={styles.label}>Hàm lượng</Text>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={strength}
              onChangeText={setStrength}
              placeholder="VD: 500mg"
            />
          </View>
        </View>

        <Text style={styles.label}>Đóng gói</Text>
        <TextInput
          style={styles.input}
          value={packaging}
          onChangeText={setPackaging}
          placeholder="VD: Hộp 2 vỉ x 10 viên"
        />

        <Text style={styles.label}>Đơn vị cơ bản *</Text>
        <TextInput
          style={styles.input}
          value={baseUnit}
          onChangeText={setBaseUnit}
          placeholder="VD: tablet, viên, viên nang"
        />

        {/* Section 2: Phân loại */}
        <Text style={styles.sectionTitle}>Phân loại</Text>

        <Text style={styles.label}>Nhóm thuốc</Text>
        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text
            style={
              categoryName
                ? styles.categorySelectorText
                : styles.categorySelectorPlaceholder
            }
          >
            {categoryName || 'Chọn nhóm thuốc'}
          </Text>
          <Text style={styles.categorySelectorArrow}>▼</Text>
        </TouchableOpacity>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Yêu cầu đơn thuốc</Text>
          <Switch
            value={prescriptionRequired}
            onValueChange={setPrescriptionRequired}
            trackColor={{ false: '#ddd', true: '#81C784' }}
            thumbColor={prescriptionRequired ? '#2EB872' : '#ccc'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Thuốc kiểm soát</Text>
          <Switch
            value={isControlled}
            onValueChange={setIsControlled}
            trackColor={{ false: '#ddd', true: '#81C784' }}
            thumbColor={isControlled ? '#2EB872' : '#ccc'}
          />
        </View>

        {/* Section 3: Giá cả - Đơn vị */}
        <Text style={styles.sectionTitle}>Giá cả - Đơn vị</Text>
        <Text style={styles.infoText}>
          Nhập giá cho các đơn vị. Hệ số (multiplier) cho biết 1 đơn vị này bằng
          bao nhiêu đơn vị cơ bản ({baseUnit || 'tablet'}).
        </Text>

        <View style={styles.unitsContainer}>
          {units.map((unit, index) => (
            <View key={index} style={styles.unitInputItem}>
              <View style={styles.unitInputHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.unitInputLabel}>Tên đơn vị *</Text>
                  <TextInput
                    style={styles.unitInput}
                    value={unit.unit}
                    onChangeText={text => handleUnitNameChange(index, text)}
                    placeholder="VD: tablet, blister, box, bottle"
                  />
                </View>
                {units.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeUnitButton}
                    onPress={() => handleRemoveUnit(index)}
                  >
                    <Text style={styles.removeUnitButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.unitInputRow}>
                <View style={styles.unitInputGroup}>
                  <Text style={styles.unitInputFieldLabel}>
                    Hệ số (multiplier) *
                  </Text>
                  <TextInput
                    style={styles.unitInput}
                    value={unit.multiplier > 0 ? String(unit.multiplier) : ''}
                    onChangeText={text =>
                      handleUnitMultiplierChange(index, text)
                    }
                    onBlur={() => handleUnitMultiplierBlur(index)}
                    keyboardType="numeric"
                    placeholder="VD: 1, 10, 100"
                  />
                  <Text style={styles.unitInputHint}>
                    = {unit.multiplier} {baseUnit || 'tablet'}
                  </Text>
                </View>
                <View style={styles.unitInputGroup}>
                  <Text style={styles.unitInputFieldLabel}>Giá (VNĐ) *</Text>
                  <TextInput
                    style={styles.unitInput}
                    value={String(unit.price || '')}
                    onChangeText={text => handleUnitPriceChange(index, text)}
                    keyboardType="numeric"
                    placeholder="VD: 5000"
                  />
                </View>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addUnitButton}
            onPress={handleAddUnit}
          >
            <Text style={styles.addUnitButtonText}>+ Thêm đơn vị</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3.5: Cấu trúc đóng gói */}
        <Text style={styles.sectionTitle}>Cấu trúc đóng gói</Text>
        <Text style={styles.infoText}>
          Cấu trúc đóng gói mô tả mối quan hệ giữa các đơn vị. Hệ thống sẽ tự
          động tạo từ thông tin đơn vị ở trên.
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Tự động tạo cấu trúc từ đơn vị</Text>
          <Switch
            value={autoGenerateStructure}
            onValueChange={value => {
              setAutoGenerateStructure(value);
              if (value) {
                generatePackageStructure(units);
              }
            }}
            trackColor={{ false: '#ddd', true: '#81C784' }}
            thumbColor={autoGenerateStructure ? '#2EB872' : '#ccc'}
          />
        </View>

        {packageStructure && (
          <View style={styles.packageStructureContainer}>
            {Object.entries(packageStructure).map(
              ([unitName, config]: [string, any]) => (
                <View key={unitName} style={styles.packageItem}>
                  <Text style={styles.label}>
                    {getUnitDisplayName(unitName)} ({unitName})
                  </Text>
                  <Text style={styles.subLabel}>
                    Chứa: {config.contains}{' '}
                    {config.child
                      ? getUnitDisplayName(config.child)
                      : baseUnit || 'tablet'}
                  </Text>
                  {!autoGenerateStructure && (
                    <>
                      <TextInput
                        style={styles.input}
                        value={String(config.contains || 0)}
                        onChangeText={text => {
                          const num = Number(text) || 0;
                          setPackageStructure({
                            ...packageStructure,
                            [unitName]: { ...config, contains: num },
                          });
                        }}
                        keyboardType="numeric"
                        placeholder="VD: 10"
                      />
                      <Text style={styles.subLabel}>
                        Đơn vị con: {config.child || baseUnit || 'tablet'}
                      </Text>
                    </>
                  )}
                </View>
              ),
            )}
          </View>
        )}

        {!packageStructure && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Chưa có cấu trúc đóng gói. Vui lòng nhập đầy đủ thông tin đơn
              vị ở trên.
            </Text>
          </View>
        )}

        {/* Section 4: Thông tin sản xuất */}
        <Text style={styles.sectionTitle}>Thông tin sản xuất</Text>

        <Text style={styles.label}>Nhà sản xuất</Text>
        <TextInput
          style={styles.input}
          value={manufacturer}
          onChangeText={setManufacturer}
          placeholder="VD: GSK"
        />

        <Text style={styles.label}>Nước sản xuất</Text>
        <TextInput
          style={styles.input}
          value={countryOfOrigin}
          onChangeText={setCountryOfOrigin}
          placeholder="VD: Anh Quốc"
        />

        <Text style={styles.label}>Số đăng ký</Text>
        <TextInput
          style={styles.input}
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          placeholder="VD: VN20230001"
        />

        <Text style={styles.label}>Mã vạch</Text>
        <TextInput
          style={styles.input}
          value={barcode}
          onChangeText={setBarcode}
          placeholder="VD: 8934123456789"
        />

        {/* Section 5: Chỉ định & Chống chỉ định */}
        <Text style={styles.sectionTitle}>Chỉ định & Chống chỉ định</Text>

        <Text style={styles.label}>Chỉ định</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={indications}
          onChangeText={setIndications}
          multiline
          placeholder="VD: Giảm đau, hạ sốt"
        />

        <Text style={styles.label}>Chống chỉ định</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={contraindications}
          onChangeText={setContraindications}
          multiline
          placeholder="VD: Hypersensitivity"
        />

        <Text style={styles.label}>Tác dụng phụ</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={sideEffects}
          onChangeText={setSideEffects}
          multiline
          placeholder="VD: Hiếm gặp"
        />

        {/* Section 6: Hướng dẫn sử dụng & Bảo quản */}
        <Text style={styles.sectionTitle}>Hướng dẫn sử dụng & Bảo quản</Text>

        <Text style={styles.label}>Hướng dẫn sử dụng</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={usageInstructions}
          onChangeText={setUsageInstructions}
          multiline
          placeholder="VD: Uống 1-2 viên, 3-4 lần/ngày"
        />

        <Text style={styles.label}>Điều kiện bảo quản</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={storageConditions}
          onChangeText={setStorageConditions}
          multiline
          placeholder="VD: Nơi khô ráo, nhiệt độ dưới 25°C"
        />

        <Text style={styles.label}>Ngưỡng cảnh báo</Text>
        <TextInput
          style={styles.input}
          value={alertThreshold}
          onChangeText={setAlertThreshold}
          keyboardType="numeric"
          placeholder="VD: 50"
        />

        {/* Section 7: Trạng thái */}
        <Text style={styles.sectionTitle}>Trạng thái</Text>

        <Text style={styles.label}>Trạng thái</Text>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() =>
            Alert.alert('Chọn trạng thái', '', [
              {
                text: 'Hoạt động',
                onPress: () => setStatus('active'),
              },
              {
                text: 'Vô hiệu hóa',
                onPress: () => setStatus('inactive'),
              },
              { text: 'Hủy', style: 'cancel' },
            ])
          }
        >
          <Text style={styles.statusButtonText}>
            {status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fixed bottom submit button */}
      <View style={styles.fixedBottom}>
        <TouchableOpacity
          style={styles.submitBtnFixed}
          onPress={onSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting
              ? mode === 'edit'
                ? 'Đang cập nhật...'
                : 'Đang gửi...'
              : mode === 'edit'
              ? 'Cập nhật'
              : '＋ Thêm thuốc'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn nhóm thuốc</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.createCategoryButton}
              onPress={() => {
                setShowCategoryModal(false);
                navigation.navigate(ROUTES.ADD_CATEGORY, {
                  fromAddMedicine: true,
                });
              }}
            >
              <Text style={styles.createCategoryButtonText}>
                + Tạo nhóm thuốc mới
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm nhóm thuốc..."
              value={categorySearch}
              onChangeText={setCategorySearch}
            />

            {categoriesLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : categories.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Không tìm thấy nhóm thuốc nào
                </Text>
              </View>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.categoryItem,
                      categoryId === item._id && styles.categoryItemSelected,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.categoryItemTouchable}
                      onPress={() => {
                        setCategoryId(item._id);
                        setCategoryName(item.name);
                        setShowCategoryModal(false);
                      }}
                    >
                      <View style={styles.categoryItemContent}>
                        <Text style={styles.categoryItemName}>{item.name}</Text>
                        {item.description && (
                          <Text style={styles.categoryItemDescription}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      {categoryId === item._id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                    <View style={styles.categoryItemActions}>
                      <TouchableOpacity
                        style={styles.categoryEditButton}
                        onPress={() => {
                          setShowCategoryModal(false);
                          navigation.navigate(ROUTES.ADD_CATEGORY, {
                            mode: 'edit',
                            item: item,
                            fromAddMedicine: true,
                          });
                        }}
                      >
                        <Text style={styles.categoryEditButtonText}>Sửa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.categoryDeleteButton}
                        onPress={() => {
                          Alert.alert(
                            'Xác nhận xóa',
                            `Bạn có chắc muốn xóa nhóm thuốc "${item.name}"?`,
                            [
                              {
                                text: 'Hủy',
                                style: 'cancel',
                              },
                              {
                                text: 'Xóa',
                                style: 'destructive',
                                onPress: async () => {
                                  try {
                                    await deleteCategory(item._id);
                                    // If deleted category was selected, clear selection
                                    if (categoryId === item._id) {
                                      setCategoryId('');
                                      setCategoryName('');
                                    }
                                    // Refresh categories list
                                    refreshCategories();
                                    Alert.alert(
                                      'Thành công',
                                      'Đã xóa nhóm thuốc',
                                    );
                                  } catch (e: any) {
                                    const errorMsg =
                                      e?.response?.data?.message ||
                                      e?.message ||
                                      'Không thể xóa nhóm thuốc';
                                    Alert.alert('Lỗi', errorMsg);
                                  }
                                },
                              },
                            ],
                          );
                        }}
                      >
                        <Text style={styles.categoryDeleteButtonText}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                style={styles.categoryList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  backBtn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: '#2EB872',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  container: { padding: 16, paddingBottom: 120 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2EB872',
    marginTop: 18,
    marginBottom: 12,
  },

  label: { fontSize: 13, color: '#333', marginTop: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    fontSize: 13,
  },

  rowHalf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  halfContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  halfInput: {
    width: '100%',
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 8,
  },

  statusButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginTop: 6,
    backgroundColor: '#f9f9f9',
  },
  statusButtonText: {
    fontSize: 13,
    color: '#333',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },

  fixedBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },
  submitBtnFixed: {
    width: '100%',
    backgroundColor: '#2EB872',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  submitText: { color: '#fff', fontWeight: '700' },

  unitsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  unitInputItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  unitInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  unitInputSubLabel: {
    fontSize: 12,
    color: '#666',
  },
  unitInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  unitInputGroup: {
    flex: 1,
  },
  unitInputFieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  unitInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#2EB872',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyUnitsText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  unitInfo: {
    flex: 1,
  },
  unitText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  unitLabel: {
    fontWeight: '600',
    color: '#666',
  },
  unitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f44336',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  packageStructureContainer: {
    marginTop: 8,
  },
  packageItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  subLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  modalClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#e5e5e5',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2EB872',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    backgroundColor: '#fff',
  },
  categorySelectorText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  categorySelectorPlaceholder: {
    fontSize: 13,
    color: '#999',
    flex: 1,
  },
  categorySelectorArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 13,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  categoryItemSelected: {
    backgroundColor: '#e8f5e9',
  },
  categoryItemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  categoryItemContent: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#2EB872',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  categoryItemActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  categoryEditButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEditButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryDeleteButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryDeleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  createCategoryButton: {
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCategoryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addUnitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addUnitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeUnitButton: {
    backgroundColor: '#f44336',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeUnitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unitInputHint: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
  },
});

export default AddMedicineScreen;
