// src/screens/sales/CreateInvoiceScreen.tsx
// Màn hình tạo hoá đơn bán hàng: chọn khách hàng -> chọn thuốc -> tính tiền -> gửi API tạo hoá đơn.

import React, { useMemo, useState, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import CustomerSelectModal from '../../components/CustomerSelectModal';
import MedicineSelectModal from '../../components/MedicineSelectModal';
import { api } from '../../services/http';

// ====== TYPES ======

type Customer = {
  _id: string | number;
  name: string;
  phone?: string;
  address?: string;
};

type InvoiceItem = {
  _id: string | number;
  name: string;
  price: number;
  unit?: string;
  qty: number;
};

type MedicineSource = {
  _id?: string | number;
  name: string;
  price?: number;
  unit?: string;
  packaging?: string;
};

interface CreateInvoiceScreenProps {
  navigation: any; // nếu dùng React Navigation có thể thay bằng type chính xác sau
}

// ====== COMPONENT CHÍNH ======

const CreateInvoiceScreen: React.FC<CreateInvoiceScreenProps> = ({
  navigation,
}) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]); // [{_id, name, price, unit, qty}]
  const [discount, setDiscount] = useState<string>('0');
  const [showCustomer, setShowCustomer] = useState<boolean>(false);
  const [showMedicine, setShowMedicine] = useState<boolean>(false);

  const total = useMemo(
    () => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0),
    [items],
  );
  const discountNum = Number(discount || 0);
  const grand = Math.max(total - discountNum, 0);

  const addItem = (m: MedicineSource): void => {
    setItems(prev => {
      const id = m._id;
      if (id == null) return prev;

      const exists = prev.find(x => x._id === id);
      if (exists) {
        return prev.map(x =>
          x._id === id ? { ...x, qty: (x.qty || 0) + 1 } : x,
        );
      }
      return [
        ...prev,
        {
          _id: id,
          name: m.name,
          price: m.price || 0,
          unit: m.unit || m.packaging,
          qty: 1,
        },
      ];
    });
  };

  const changeQty = (id: string | number, delta: number): void => {
    setItems(prev => {
      const next = prev
        .map(x =>
          x._id === id ? { ...x, qty: Math.max((x.qty || 0) + delta, 0) } : x,
        )
        .filter(x => x.qty > 0);
      return next;
    });
  };

  const removeItem = (id: string | number): void =>
    setItems(prev => prev.filter(x => x._id !== id));

  const submit = async (): Promise<void> => {
    if (!customer) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn khách hàng.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn ít nhất 1 thuốc.');
      return;
    }

    try {
      const payload = {
        customerId: customer._id,
        items: items.map(it => ({
          medicineId: it._id,
          quantity: it.qty,
          price: it.price,
        })),
        discount: discountNum,
        total: grand,
      };
      await api.post('/invoices', payload);
      Alert.alert('Thành công', 'Đã tạo hoá đơn.');
      setItems([]);
      setDiscount('0');
    } catch (e: any) {
      Alert.alert('Không thể tạo hoá đơn', e?.message || 'Đã xảy ra lỗi');
    }
  };

  const renderRow: ListRenderItem<InvoiceItem> = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#eef2f7',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
        <Text style={{ color: '#64748b', marginTop: 2 }}>
          {item.unit} • {formatCurrency(item.price)}
        </Text>
      </View>

      <View
        style={
          {
            flexDirection: 'row',
            alignItems: 'center',
            // nếu TS/phien bản RN chưa hỗ trợ "gap" có thể bỏ dòng này
            gap: 8,
          } as any
        }
      >
        <QtyBtn label="−" onPress={() => changeQty(item._id, -1)} />
        <Text style={{ minWidth: 24, textAlign: 'center', fontWeight: '700' }}>
          {item.qty}
        </Text>
        <QtyBtn label="+" onPress={() => changeQty(item._id, +1)} />
      </View>

      <TouchableOpacity onPress={() => removeItem(item._id)}>
        <Text style={{ color: '#ef4444', marginLeft: 12, fontWeight: '700' }}>
          Xoá
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <Text style={styles.header}>Tạo Hóa Đơn Bán Hàng</Text>

        {/* Thông tin khách hàng */}
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <TouchableOpacity
          onPress={() => setShowCustomer(true)}
          style={styles.selector}
        >
          <Text style={{ color: customer ? '#111827' : '#9CA3AF' }}>
            {customer ? customer.name : 'Chọn khách hàng'}
          </Text>
        </TouchableOpacity>

        {/* Tìm thuốc */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Tìm thuốc</Text>
        <View
          style={
            {
              flexDirection: 'row',
              // gap: 8,
            } as any
          }
        >
          <TextInput
            placeholder="Nhập tên thuốc..."
            editable={false}
            style={[styles.input, { flex: 1, color: '#9CA3AF' }]}
            value=""
          />
          <TouchableOpacity
            onPress={() => setShowMedicine(true)}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Chọn</Text>
          </TouchableOpacity>
        </View>

        {/* Danh sách thuốc */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Danh sách thuốc
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
          }}
        >
          {items.length === 0 ? (
            <Text style={{ padding: 16, color: '#64748b' }}>
              Chưa có thuốc nào. Nhấn "Chọn" để thêm.
            </Text>
          ) : (
            <FlatList
              data={items}
              keyExtractor={it => String(it._id)}
              renderItem={renderRow}
            />
          )}
        </View>

        {/* + Thêm thuốc */}
        <TouchableOpacity
          onPress={() => setShowMedicine(true)}
          style={styles.ghostBtn}
        >
          <Text style={{ color: '#256D4A', fontWeight: '700' }}>
            + Thêm thuốc
          </Text>
        </TouchableOpacity>

        {/* Tổng thanh toán */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Tổng thanh toán
        </Text>
        <View style={styles.summaryBox}>
          <Row label="Tổng cộng" value={formatCurrency(total)} />
          <Row
            label="Giảm giá"
            value={
              <TextInput
                keyboardType="numeric"
                value={discount}
                onChangeText={setDiscount}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  height: 32,
                  minWidth: 100,
                  textAlign: 'right',
                }}
              />
            }
          />
          <Row
            label="Thành tiền"
            value={
              <Text style={{ fontWeight: '800' }}>{formatCurrency(grand)}</Text>
            }
          />
        </View>

        <TouchableOpacity
          onPress={submit}
          style={[styles.primaryBtn, { marginTop: 12 }]}
        >
          <Text style={styles.primaryBtnText}>Xuất Hóa Đơn</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CustomerSelectModal
        visible={showCustomer}
        onClose={() => setShowCustomer(false)}
        onSelected={c => setCustomer(c as Customer)}
      />
      <MedicineSelectModal
        visible={showMedicine}
        onClose={() => setShowMedicine(false)}
        onPicked={addItem}
      />
    </SafeAreaView>
  );
};

// ====== COMPONENT PHỤ ======

interface RowProps {
  label: string;
  value: string | number | ReactNode;
}

const Row: React.FC<RowProps> = ({ label, value }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: '#64748b' }}>{label}</Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
};

interface QtyBtnProps {
  label: string;
  onPress: () => void;
}

const QtyBtn: React.FC<QtyBtnProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '900' }}>{label}</Text>
    </TouchableOpacity>
  );
};

// ====== STYLES & HELPERS ======

const styles: { [key: string]: any } = {
  header: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    color: '#111827',
  },
  sectionTitle: {
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 6,
    color: '#111827',
  },
  selector: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  ghostBtn: {
    marginTop: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#256D4A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
  summaryBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
  },
};

const formatCurrency = (n: number = 0): string =>
  (n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

export default CreateInvoiceScreen;
