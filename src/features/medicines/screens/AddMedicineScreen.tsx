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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMedicine, updateMedicine } from '../services/medicineService';
import { useNavigation, useRoute } from '@react-navigation/native';

const AddMedicineScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mode = route.params?.mode ?? 'create';
  const editingItem = route.params?.item ?? null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // ISO yyyy-mm-dd
  const [supplierId, setSupplierId] = useState('');
  const [warningThreshold, setWarningThreshold] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setName(editingItem.name ?? '');
      setDescription(editingItem.description ?? '');
      setCategory(editingItem.category ?? '');
      setUnit(editingItem.unit ?? '');
      setPrice(editingItem.price != null ? String(editingItem.price) : '');
      setExpiryDate(editingItem.expiry_date ?? '');
      setSupplierId(
        editingItem.supplier_id ? String(editingItem.supplier_id) : '',
      );
      setWarningThreshold(
        editingItem.warning_threshold != null
          ? String(editingItem.warning_threshold)
          : '',
      );
      // quantity has been removed from the form
    }
  }, [mode, editingItem]);

  // DatePicker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatISOToDDMMYYYY = (iso?: string) => {
    if (!iso) return '';
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return iso;
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const onDateChange = (_event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selected) {
      const iso = selected.toISOString().split('T')[0]; // yyyy-mm-dd
      setExpiryDate(iso);
    }
  };

  const validate = () => {
    if (!name.trim()) return 'Tên thuốc là bắt buộc';
    if (!price.trim() || Number.isNaN(Number(price)))
      return 'Giá hợp lệ là bắt buộc';
    if (!expiryDate.trim()) return 'Hạn sử dụng là bắt buộc';
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
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      unit: unit.trim() || undefined,
      price: Number(price),
      expiry_date: expiryDate.trim(), // send ISO yyyy-mm-dd
      supplier_id: supplierId.trim() || undefined,
      warning_threshold: warningThreshold
        ? Number(warningThreshold)
        : undefined,
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
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'edit' ? 'Cập nhật thuốc' : 'Thêm thuốc mới'}
        </Text>
        <View style={{ width: 40 }} /> {/* placeholder để title căn giữa */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tên thuốc"
        />

        <Text style={styles.label}>Nhà cung cấp (id)</Text>
        <TextInput
          style={styles.input}
          value={supplierId}
          onChangeText={setSupplierId}
          placeholder="supplier id"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="10000"
        />

        <View style={styles.rowHalf}>
          <View style={styles.halfContainer}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={unit}
              onChangeText={setUnit}
              placeholder="Hộp/Viên..."
            />
          </View>

          <View style={styles.halfContainer}>
            <Text style={styles.label}>Expiry</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <View pointerEvents="none">
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  value={formatISOToDDMMYYYY(expiryDate)}
                  editable={false}
                  placeholder="Chọn ngày"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowHalf}>
          <View style={styles.halfContainer}>
            <Text style={styles.label}>Danh mục</Text>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={category}
              onChangeText={setCategory}
              placeholder="Danh mục"
            />
          </View>

          <View style={styles.halfContainer}>
            <Text style={styles.label}>Warning threshold</Text>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={warningThreshold}
              onChangeText={setWarningThreshold}
              keyboardType="numeric"
              placeholder="200"
            />
          </View>
        </View>

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Mô tả..."
        />
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

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate ? new Date(expiryDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
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

  container: { padding: 16, paddingBottom: 120 }, // paddingBottom to avoid being hidden by fixed button
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  label: { fontSize: 13, color: '#333', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
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

  fixedBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'transparent',
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
