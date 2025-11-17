// src/components/MedicinePickerModal.tsx
// Tìm & Chọn Thuốc (giống mockup): ô tìm, chip lọc, danh sách, Huỷ / Thêm vào đơn (n)

import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { api } from '../services/http';

// ====== TYPES ======

type Medicine = {
  _id?: string | number;
  id?: string | number;
  name: string;
  price?: number;
  unit?: string;
};

type MedicineCategory = {
  key: string;
  label: string;
};

interface MedicinePickerModalProps {
  visible: boolean;
  onClose?: () => void;
  onConfirm?: (items: Medicine[]) => void;
}

interface FetchMedicinesParams {
  keyword?: string;
  cat?: string;
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

// ====== COMPONENT ======

const MedicinePickerModal: React.FC<MedicinePickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [data, setData] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<Record<string, Medicine>>({}); // id -> medicine

  // Chip mặc định (nếu BE không có endpoint category)
  const [categories, setCategories] = useState<MedicineCategory[]>([
    { key: 'antipyretic', label: 'Hạ sốt' },
    { key: 'vitamin', label: 'Vitamin' },
    { key: 'antibiotic', label: 'Kháng sinh' },
    { key: 'other', label: 'Khác' },
  ]);

  useEffect(() => {
    if (!visible) return;
    setKeyword('');
    setCategory('all');
    setSelected({});
    fetchMedicines({});
    fetchCategoriesSafely();
  }, [visible]);

  const fetchCategoriesSafely = async (): Promise<void> => {
    try {
      // Nếu có /medicines/categories → [{key,label}]
      const res = await api.get<any>('/medicines/categories').catch(() => null);
      const list = res?.data?.data || res?.data;
      if (Array.isArray(list) && list.length) {
        setCategories(list as MedicineCategory[]);
      }
    } catch {
      console.log('Fetch categories failed');
    }
  };

  const fetchMedicines = async ({
    keyword = '',
    cat,
  }: FetchMedicinesParams = {}): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<any>('/medicines', {
        params: { keyword, category: cat && cat !== 'all' ? cat : undefined },
      });
      const list = (res.data?.data || res.data || []) as Medicine[];
      setData(list);
    } catch (e: any) {
      Alert.alert('Lỗi', e?.message || 'Không thể tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  const togglePick = (m: Medicine): void => {
    setSelected(s => {
      const rawId = m._id ?? m.id;
      if (rawId == null) return s;
      const id = String(rawId);

      const next = { ...s };
      if (next[id]) delete next[id];
      else next[id] = m;
      return next;
    });
  };

  const selectedCount = useMemo(() => Object.keys(selected).length, [selected]);

  const renderItem: ListRenderItem<Medicine> = ({ item }) => {
    const id = String(item._id ?? item.id);
    const isChecked = !!selected[id];

    return (
      <View
        style={{
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e7ecef',
          backgroundColor: '#fff',
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/* Ảnh placeholder */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: '#E8F3EC',
          }}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontWeight: '700' }}>{item.name}</Text>
          <Text style={{ color: '#64748b', marginTop: 2 }}>
            Giá: {formatCurrency(item.price || 0)}{' '}
            {item.unit ? ` / ${item.unit}` : ''}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => togglePick(item)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 10,
            backgroundColor: isChecked ? '#DCFCE7' : '#256D4A',
            borderWidth: isChecked ? 1 : 0,
            borderColor: '#16a34a',
          }}
        >
          <Text
            style={{ color: isChecked ? '#166534' : '#fff', fontWeight: '800' }}
          >
            {isChecked ? 'Đã chọn' : 'Chọn'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '92%',
          }}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              textAlign: 'center',
              paddingVertical: 8,
              borderBottomColor: '#e5e7eb',
              borderBottomWidth: 1,
            }}
          >
            Tìm & Chọn Thuốc
          </Text>

          {/* Tìm kiếm */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <TextInput
              placeholder="Nhập tên thuốc..."
              value={keyword}
              onChangeText={setKeyword}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 44,
                backgroundColor: '#fff',
              }}
              returnKeyType="search"
              onSubmitEditing={() => fetchMedicines({ keyword, cat: category })}
            />
            <TouchableOpacity
              onPress={() => fetchMedicines({ keyword, cat: category })}
              style={{
                marginLeft: 8,
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#256D4A',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>🔎</Text>
            </TouchableOpacity>
          </View>

          {/* Chips */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 10,
            }}
          >
            <Chip
              label="Tất cả"
              active={category === 'all'}
              onPress={() => {
                setCategory('all');
                fetchMedicines({ keyword, cat: 'all' });
              }}
            />
            {categories.map(c => (
              <Chip
                key={c.key}
                label={c.label}
                active={category === c.key}
                onPress={() => {
                  setCategory(c.key);
                  fetchMedicines({ keyword, cat: c.key });
                }}
              />
            ))}
          </View>

          {/* Kết quả */}
          <Text
            style={{
              marginTop: 12,
              marginBottom: 6,
              fontWeight: '700',
              color: '#111827',
            }}
          >
            Kết quả tìm kiếm
          </Text>

          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            ) : (
              <FlatList
                data={data}
                keyExtractor={it => String(it._id ?? it.id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 12 }}
                ListEmptyComponent={
                  <Text style={{ color: '#64748b', paddingVertical: 12 }}>
                    Không có dữ liệu
                  </Text>
                }
              />
            )}
          </View>

          {/* Footer */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#cbd5e1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#0f172a' }}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={selectedCount === 0}
              onPress={() => {
                const arr = Object.values(selected) as Medicine[];
                onConfirm?.(arr);
                onClose?.();
              }}
              style={{
                marginLeft: 12,
                flex: 1,
                height: 48,
                borderRadius: 12,
                backgroundColor: selectedCount ? '#256D4A' : '#9CA3AF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '800' }}>
                Thêm vào đơn{selectedCount ? ` (${selectedCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// ====== SUB COMPONENTS & HELPERS ======

const Chip: React.FC<ChipProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginRight: 8,
        marginBottom: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? '#DCFCE7' : '#F1F5F9',
        borderWidth: 1,
        borderColor: active ? '#86efac' : '#e5e7eb',
      }}
    >
      <Text
        style={{ color: active ? '#166534' : '#0f172a', fontWeight: '700' }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const formatCurrency = (n: number = 0): string =>
  (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default MedicinePickerModal;
