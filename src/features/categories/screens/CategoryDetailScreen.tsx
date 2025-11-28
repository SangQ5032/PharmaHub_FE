import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';
import { deleteCategory, getCategoryById } from '../services/categoriesService';

const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '-'}</Text>
  </View>
);

const CategoryDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<MainStackParamList, typeof ROUTES.CATEGORY_DETAIL>>();
  const categoryId = (route.params as any)?.categoryId as string | undefined;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);

  const load = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCategoryById(categoryId);
      // support format {data}
      setItem((data as any)?.data ?? data);
    } catch (e: any) {
      setError(e?.message || 'Không thể tải chi tiết');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = () => {
    if (!item?._id) return;
    Alert.alert('Xác nhận', 'Xóa danh mục này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(String(item._id));
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('Lỗi', e?.message || 'Không thể xóa');
          }
        },
      },
    ]);
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
        <Text style={styles.titleText}>Chi tiết danh mục</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color="#2EB872" />
          <Text style={styles.muted}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={load}
          >
            <Text style={[styles.btnText, styles.btnPrimaryText]}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Row label="Tên" value={item?.name} />
          <Row label="Mô tả" value={item?.description} />
          <Row label="Created At" value={item?.createdAt} />
          <Row label="Updated At" value={item?.updatedAt} />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost]}
              onPress={() =>
                navigation.navigate(ROUTES.ADD_CATEGORY as any, {
                  mode: 'edit',
                  item,
                })
              }
            >
              <Text style={[styles.btnText, styles.btnGhostText]}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnDanger]}
              onPress={onDelete}
            >
              <Text style={[styles.btnText, styles.btnDangerText]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },
  backBtn: { position: 'absolute', left: 12, top: 18 },
  backText: { color: '#fff', fontWeight: '500' },
  content: { padding: 16, paddingBottom: 40 },
  row: { flexDirection: 'row', marginBottom: 10 },
  rowLabel: { width: 110, color: '#666' },
  rowValue: { flex: 1, color: '#222' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnText: { fontWeight: '700' },
  btnPrimary: { backgroundColor: '#2EB872' },
  btnPrimaryText: { color: '#fff' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0' },
  btnGhostText: { color: '#333' },
  btnDanger: { backgroundColor: '#D32F2F' },
  btnDangerText: { color: '#fff' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#888', marginTop: 8 },
  errorText: { color: '#D32F2F', marginBottom: 12 },
});

export default CategoryDetailScreen;
