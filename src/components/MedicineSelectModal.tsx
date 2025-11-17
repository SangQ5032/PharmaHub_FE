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
  ListRenderItem,
} from 'react-native';
import { api } from '../services/http';

// ====== TYPES ======

type Medicine = {
  _id?: string | number;
  id?: string | number;
  name: string;
  strength?: string;
  unit?: string;
  packaging?: string;
  price?: number;
};

interface MedicineSelectModalProps {
  visible: boolean;
  onClose?: () => void;
  onPicked?: (medicine: Medicine) => void;
}

// ====== COMPONENT ======

const MedicineSelectModal: React.FC<MedicineSelectModalProps> = ({
  visible,
  onClose,
  onPicked,
}) => {
  const [q, setQ] = useState<string>('');
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    setQ('');
    setData([]);
    fetchMedicines('');
  }, [visible]);

  const fetchMedicines = async (keyword: string): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<any>('/medicines', { params: { keyword } });
      const list = (res.data?.data || res.data || []) as Medicine[];
      setData(list);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  const renderItem: ListRenderItem<Medicine> = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        onPicked?.(item);
        onClose?.();
      }}
      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
    >
      <Text style={{ fontWeight: '600' }}>{item.name}</Text>
      <Text style={{ color: '#666', marginTop: 2 }}>
        {item.strength ? `${item.strength} • ` : ''}
        {item.unit || item.packaging}
      </Text>
      <Text
        style={{
          color: '#256D4A',
          marginTop: 6,
          fontWeight: '700',
        }}
      >
        {formatCurrency(item.price || 0)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '85%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700' }}>Chọn thuốc</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#256D4A', fontWeight: '600' }}>Đóng</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              // nếu TS kêu lỗi ở "gap", có thể bỏ gap và cho marginLeft vào nút Tìm
              // gap: 8,
            }}
          >
            <TextInput
              placeholder="Nhập tên thuốc, hoạt chất..."
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
              onSubmitEditing={() => fetchMedicines(q)}
            />
            <TouchableOpacity
              onPress={() => fetchMedicines(q)}
              style={{
                marginLeft: 8, // thay cho gap nếu cần
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
                keyExtractor={it => String(it._id ?? it.id)}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={{ padding: 16, color: '#666' }}>
                    Không có dữ liệu
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const formatCurrency = (n: number = 0): string =>
  (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default MedicineSelectModal;
