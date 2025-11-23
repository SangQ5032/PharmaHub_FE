import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useCreateBranch, useUpdateBranch } from '../hooks/useBranches';
import { useNavigation, useRoute } from '@react-navigation/native';

const BranchFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mode, item } = route.params || { mode: 'create' };

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [revenueTarget, setRevenueTarget] = useState<string>('0');

  const createMut = useCreateBranch();
  const updateMut = useUpdateBranch();

  useEffect(() => {
    if (mode === 'edit' && item) {
      setName(item.name || '');
      setAddress(item.address || '');
      setPhone(item.phone || '');
      setRevenueTarget(String(item.revenue_target ?? '0'));
    }
  }, [mode, item]);

  const onSubmit = async () => {
    const payload = {
      name,
      address,
      phone,
      revenue_target: Number(revenueTarget) || 0,
    };

    try {
      if (mode === 'edit' && item && item._id) {
        await updateMut.mutateAsync({ id: item._id, payload });
      } else {
        await createMut.mutateAsync(payload);
      }
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể lưu chi nhánh');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên chi nhánh</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Mục tiêu doanh thu</Text>
      <TextInput
        style={styles.input}
        value={revenueTarget}
        onChangeText={setRevenueTarget}
        keyboardType="numeric"
      />

      <Button
        title={mode === 'edit' ? 'Cập nhật' : 'Tạo chi nhánh'}
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { marginTop: 12, fontSize: 14, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
});

export default BranchFormScreen;
