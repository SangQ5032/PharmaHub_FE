import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { ROUTES } from '@shared/constants/routes';
import { deleteSupplier, getSupplier } from '../services/supplierService';

const SuppliersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { suppliers, loading, error, refresh, search, setSearch } =
    useSuppliers();
  const [detailVisible, setDetailVisible] = React.useState(false);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detail, setDetail] = React.useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Xóa nhà cung cấp này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteSupplier(id);
            refresh();
          } catch (e: any) {
            Alert.alert('Lỗi', e?.message ?? 'Không thể xóa');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemRow}>
      <View style={[styles.cell, { flex: 40 }]}>
        <TouchableOpacity onPress={() => openDetail(String(item._id))}>
          <Text style={[styles.cellText, styles.link]} numberOfLines={1}>
            {item.name || '-'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.cell, { flex: 35, marginRight: 10 }]}>
        <Text style={[styles.cellText, styles.center]} numberOfLines={1}>
          {item?.contact?.phone || item?.phone || '-'}
        </Text>
      </View>
      <View style={[styles.cell, { flex: 25, alignItems: 'flex-end' }]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.edit]}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_SUPPLIER, { mode: 'edit', item })
            }
          >
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.delete]}
            onPress={() => handleDelete(String(item._id))}
          >
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const openDetail = async (id: string) => {
    try {
      setDetailVisible(true);
      setDetailLoading(true);
      const data = await getSupplier(id);
      setDetail(data);
    } catch (e: any) {
      // fallback: ẩn modal nếu lỗi
      Alert.alert('Lỗi', e?.message ?? 'Không thể tải chi tiết');
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Quản lý nhà cung cấp</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Tìm theo tên nhà cung cấp..."
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.left]}>TÊN</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.center]}>SĐT</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.right]}>HÀNH ĐỘNG</Text>
          </View>
        </View>

        {error ? <Text style={styles.error}>Lỗi: {String(error)}</Text> : null}

        <FlatList
          data={suppliers}
          keyExtractor={(item: any) => String(item._id)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          contentContainerStyle={
            suppliers.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>Không có dữ liệu</Text>
            ) : null
          }
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.pillButton}
            onPress={() => navigation.navigate(ROUTES.ADD_SUPPLIER)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillButtonText}>＋ Thêm nhà cung cấp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Detail Modal */}
      <Modal
        visible={detailVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Chi tiết nhà cung cấp</Text>
            {detailLoading ? (
              <Text style={styles.muted}>Đang tải...</Text>
            ) : (
              <View>
                {(() => {
                  const d = detail?.data ?? detail; // hỗ trợ format {success, data}
                  return (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tên:</Text>
                        <Text style={styles.detailValue}>{d?.name || '-'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Trạng thái:</Text>
                        <Text style={styles.detailValue}>
                          {d?.status || '-'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>SĐT:</Text>
                        <Text style={styles.detailValue}>
                          {d?.contact?.phone || d?.phone || '-'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>
                          {d?.contact?.email || d?.email || '-'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Địa chỉ:</Text>
                        <Text style={styles.detailValue}>
                          {d?.contact?.address || d?.address || '-'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ghi chú:</Text>
                        <Text style={styles.detailValue}>
                          {d?.note || d?.description || '-'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>ID:</Text>
                        <Text style={styles.detailValue}>{d?._id || '-'}</Text>
                      </View>
                    </>
                  );
                })()}
              </View>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.btnPrimary, { marginTop: 12 }]}
              onPress={() => setDetailVisible(false)}
            >
              <Text style={[styles.modalButtonText, styles.btnPrimaryText]}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  searchContainer: { paddingHorizontal: 12, marginBottom: 10, marginTop: 10 },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 6,
    alignItems: 'center',
  },
  headerCell: { flex: 1, paddingHorizontal: 6, minWidth: 0 },
  headerText: { fontSize: 13, fontWeight: '700', color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { paddingHorizontal: 6, minWidth: 0 },
  cellText: { fontSize: 14, color: '#222' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 5,
  },
  actionText: { color: '#fff', fontWeight: '700' },
  edit: { backgroundColor: '#1976D2' },
  delete: { backgroundColor: '#D32F2F' },
  error: { color: 'red', marginHorizontal: 12, marginBottom: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666', padding: 20 },
  bottomBar: { padding: 12 },
  link: { color: '#1B5E20', fontWeight: '700' },
  pillButton: {
    width: '100%',
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  pillButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  detailCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  detailTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  detailRow: { flexDirection: 'row', marginTop: 6 },
  detailLabel: { width: 100, color: '#666' },
  detailValue: { flex: 1, color: '#222' },
  modalButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  modalButtonText: { fontWeight: '700', textAlign: 'center', width: '100%' },
  btnPrimary: { backgroundColor: '#2EB872' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  muted: { color: '#888' },
});

export default SuppliersScreen;
