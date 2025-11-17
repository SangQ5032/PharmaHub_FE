import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { api } from '../services/http';

type Customer = {
  _id?: string | number;
  id?: string | number;
  name: string;
  phone?: string;
  address?: string;
};

type CustomerForm = {
  name: string;
  phone: string;
  address: string;
};

interface CustomerSelectModalProps {
  visible: boolean;
  onClose?: () => void;
  onSelected?: (customer: Customer) => void;
}

const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({
  visible,
  onClose,
  onSelected,
}) => {
  const [tab, setTab] = useState<'list' | 'create'>('list'); // "list" | "create"
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string>('');
  const [data, setData] = useState<Customer[]>([]);
  const [form, setForm] = useState<CustomerForm>({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!visible) return;
    setTab('list');
    fetchCustomers('');
  }, [visible]);

  const fetchCustomers = async (keyword: string = ''): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<any>('/customers', { params: { keyword } });
      const customers = (res.data?.data || res.data || []) as Customer[];
      setData(customers);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async (): Promise<void> => {
    if (!form.name?.trim()) {
      Alert.alert('Thiếu thông tin', 'Nhập tên khách hàng.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post<any>('/customers', form);
      const customer = (res.data?.data || res.data) as Customer;
      onSelected?.(customer);
      onClose?.();
    } catch (e: any) {
      Alert.alert('Không thể tạo khách hàng', e?.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<Customer> = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onSelected?.(item);
        onClose?.();
      }}
      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#e6e6e6' }}
    >
      <Text style={{ fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ color: '#666' }}>
        {item.phone} • {item.address}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '88%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>
              {tab === 'list' ? 'Chọn khách hàng' : 'Thêm khách hàng'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#256D4A', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>

          {tab === 'list' ? (
            <View>
              <View
                style={{
                  marginTop: 12,
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <TextInput
                  placeholder="Tìm theo tên, SĐT..."
                  value={q}
                  onChangeText={setQ}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    height: 44,
                    backgroundColor: '#fff',
                  }}
                  returnKeyType="search"
                  onSubmitEditing={() => fetchCustomers(q)}
                />
                <TouchableOpacity
                  onPress={() => fetchCustomers(q)}
                  style={{
                    height: 44,
                    paddingHorizontal: 16,
                    backgroundColor: '#256D4A',
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Tìm</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: 12,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                }}
              >
                {loading ? (
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <ActivityIndicator />
                  </View>
                ) : (
                  <FlatList
                    data={data}
                    keyExtractor={it => (it._id ?? it.id ?? '').toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={
                      <Text style={{ padding: 16, color: '#666' }}>
                        Không có dữ liệu
                      </Text>
                    }
                  />
                )}
              </View>

              <TouchableOpacity
                onPress={() => setTab('create')}
                style={{
                  marginTop: 12,
                  backgroundColor: '#F1F5F9',
                  borderRadius: 12,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#256D4A', fontWeight: '700' }}>
                  + Thêm khách hàng
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 12, gap: 10 }}>
              <TextInput
                placeholder="Tên khách hàng *"
                value={form.name}
                onChangeText={t => setForm(s => ({ ...s, name: t }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={t => setForm(s => ({ ...s, phone: t }))}
                style={styles.input}
              />
              <TextInput
                placeholder="Địa chỉ"
                value={form.address}
                onChangeText={t => setForm(s => ({ ...s, address: t }))}
                style={[
                  styles.input,
                  {
                    height: 80,
                    textAlignVertical: 'top',
                    paddingTop: 10,
                  },
                ]}
                multiline
              />

              <TouchableOpacity
                disabled={loading}
                onPress={onCreate}
                style={[styles.primaryBtn, { opacity: loading ? 0.6 : 1 }]}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? 'Đang lưu...' : 'Lưu & chọn khách hàng'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTab('list')}
                style={styles.ghostBtn}
              >
                <Text style={{ color: '#256D4A', fontWeight: '700' }}>
                  ← Quay lại danh sách
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles: { [key: string]: any } = {
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 44,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: '#256D4A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  ghostBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
};

export default CustomerSelectModal;
