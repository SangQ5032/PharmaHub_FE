import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';
import { createSupplier, updateSupplier } from '../services/supplierService';

const AddSupplierScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<MainStackParamList, typeof ROUTES.ADD_SUPPLIER>>();
  const mode = (route.params as any)?.mode as 'edit' | undefined;
  const editingItem = (route.params as any)?.item;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  // Đổi tên description -> note cho khớp với API backend
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setName(editingItem.name || '');
      setPhone(editingItem?.contact?.phone || editingItem.phone || '');
      setEmail(editingItem?.contact?.email || editingItem.email || '');
      setAddress(editingItem?.contact?.address || editingItem.address || '');
      setNote(editingItem?.note || editingItem.description || '');
      setStatus(editingItem?.status || 'active');
    }
  }, [mode, editingItem]);

  const validate = () => {
    if (!name.trim()) return 'Tên là bắt buộc';
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Lỗi', err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        // Giữ dạng phẳng; service sẽ chuẩn hóa lại contact
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        note: note.trim() || undefined,
        status: status || undefined,
      };
      if (mode === 'edit' && editingItem?._id) {
        await updateSupplier(String(editingItem._id), payload);
      } else {
        await createSupplier(payload);
      }
      navigation.goBack();
    } catch (e: any) {
      // Thông báo chi tiết hơn nếu server trả về message/error
      const serverMsg = e?.response?.data?.message || e?.response?.data?.error;
      Alert.alert('Lỗi', serverMsg || e?.message || 'Không thể lưu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {mode === 'edit' ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Tên *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Tên nhà cung cấp"
        />

        <Text style={styles.label}>SĐT</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Địa chỉ"
        />

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={note}
          onChangeText={setNote}
          placeholder="Ghi chú (note)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View style={{ height: 80 }} />
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          disabled={submitting}
          onPress={onSubmit}
        >
          <Text style={styles.submitText}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleContainer: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },
  form: { padding: 16, paddingBottom: 40 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  multiline: { height: 120 },
  bottomBar: { padding: 16 },
  submitBtn: {
    backgroundColor: '#2EB872',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backBtn: { position: 'absolute', left: 12, top: 18 },
  backText: { color: '#fff', fontWeight: '500' },
});

export default AddSupplierScreen;
