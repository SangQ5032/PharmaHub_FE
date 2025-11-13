import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';

const Row: React.FC<{ label: string; value?: string | number | null }> = ({
  label,
  value,
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {value == null || value === '' ? '-' : String(value)}
    </Text>
  </View>
);

const formatDate = (d?: string) => {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const MedicineDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<MainStackParamList, typeof ROUTES.MEDICINE_DETAIL>>();
  const item: any = (route.params as any)?.item ?? {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết thuốc</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Row label="Tên" value={item.name} />
          <Row label="Mô tả" value={item.description} />
          <Row label="Danh mục" value={item.category} />
          <Row label="Đơn vị" value={item.unit} />
          <Row label="Giá" value={item.price} />
          <Row label="HSD" value={formatDate(item.expiry_date)} />
          <Row label="Cảnh báo tồn" value={item.warning_threshold} />
          <Row label="Supplier ID" value={item.supplier_id} />
          <Row label="ID" value={item._id} />
          <Row label="Tạo lúc" value={item.createdAt} />
          <Row label="Cập nhật" value={item.updatedAt} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  backBtn: { position: 'absolute', left: 12, top: 18 },
  backText: { color: '#fff', fontWeight: '600' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  label: { color: '#333', fontWeight: '700', marginRight: 8, flex: 1 },
  value: { color: '#555', flex: 2, textAlign: 'right' },
});

export default MedicineDetailScreen;
