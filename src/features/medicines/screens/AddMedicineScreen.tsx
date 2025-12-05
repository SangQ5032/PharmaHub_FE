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
} from 'react-native';
import { createMedicine, updateMedicine } from '../services/medicineService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Medicine } from '../types';

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
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [isControlled, setIsControlled] = useState(false);
  const [units, setUnits] = useState<any[]>([]);
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

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setName(editingItem.name ?? '');
      setGenericName(editingItem.generic_name ?? '');
      setBrandName(editingItem.brand_name ?? '');
      setDosageForm(editingItem.dosage_form ?? '');
      setStrength(editingItem.strength ?? '');
      setPackaging(editingItem.packaging ?? '');
      setCategoryId(editingItem.category_id?._id ?? '');
      setPrescriptionRequired(editingItem.prescription_required ?? false);
      setIsControlled(editingItem.is_controlled ?? false);
      setUnits(editingItem.units ?? []);
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
    if (!units || units.length === 0) return 'Phải thêm ít nhất một đơn vị giá';
    return null;
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
      packaging: packaging.trim() || undefined,
      category_id: categoryId.trim() || undefined,
      prescription_required: prescriptionRequired,
      is_controlled: isControlled,
      units: units,
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
        Alert.alert('Thành công', 'Đã thêm thuốc', [
          { text: 'OK', onPress: () => navigation.goBack() },
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

        {/* Section 2: Phân loại */}
        <Text style={styles.sectionTitle}>Phân loại</Text>

        <Text style={styles.label}>Category ID</Text>
        <TextInput
          style={styles.input}
          value={categoryId}
          onChangeText={setCategoryId}
          placeholder="ID của nhóm thuốc"
        />

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

        {/* Section 3: Giá cả */}
        <Text style={styles.sectionTitle}>Giá cả - Đơn vị</Text>
        <Text style={styles.infoText}>
          Thông tin giá và đơn vị sẽ được quản lý thông qua API. Hiện tại hệ
          thống yêu cầu định nghĩa các unit (box, blister, tablet) với giá tương
          ứng.
        </Text>

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
});

export default AddMedicineScreen;
