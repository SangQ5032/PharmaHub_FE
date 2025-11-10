import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useMedicines } from '../hooks/useMedicines';
import MedicineItem from '../components/MedicineItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import apiClient from '@shared/services/api';

const MedicineListScreen: React.FC = () => {
  const { medicines, loading, error, errorDetail, refresh } = useMedicines();
  const navigation = useNavigation<any>();

  const baseURL =
    (apiClient && (apiClient.defaults as any)?.baseURL) || '<no-baseURL>';

  // refresh mỗi lần màn này được focus (sau edit/xóa quay về)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <View style={styles.container}>
      {/* Tiêu đề được bọc trong titleContainer để căn giữa theo chiều dọc */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Danh sách thuốc</Text>
      </View>

      <View style={styles.debugRow}>
        <Text style={styles.debugLabel}>API:</Text>
        <Text style={styles.debugValue}>{baseURL}</Text>
      </View>

      {/* Phần danh sách chiếm 90% (flex:9) */}
      <View style={styles.listContainer}>
        {/* Header row: 4 cột bằng nhau */}
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.left]}>TÊN THUỐC</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.center]}>GIÁ</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={[styles.headerText, styles.center]}>HSD</Text>
          </View>
          <View style={styles.headerCell}>
            <Text
              style={[styles.headerText, styles.right, { textAlign: 'center' }]}
            >
              SL
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Lỗi khi tải dữ liệu:</Text>
            <Text style={styles.errorText}>{String(error)}</Text>
            <Text style={styles.errorSmall}>
              Status: {String(errorDetail?.responseStatus ?? '-')}
            </Text>
            <ScrollView style={styles.errorPayload} horizontal>
              <Text selectable style={styles.errorSmall}>
                {JSON.stringify(
                  errorDetail?.responseData ?? errorDetail ?? {},
                  null,
                  2,
                )}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.retry} onPress={refresh}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <FlatList
          data={medicines}
          keyExtractor={item => String(item._id)}
          renderItem={({ item }) => (
            <MedicineItem item={item} onUpdated={refresh} />
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
          contentContainerStyle={
            medicines.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>Không có dữ liệu</Text>
            ) : null
          }
        />
      </View>

      {/* Bottom bar chiếm 10% (flex:1) chứa nút viên thuốc "+ Thêm thuốc" */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.pillButton}
          onPress={() => navigation.navigate(ROUTES.ADD_MEDICINE)}
          activeOpacity={0.8}
        >
          <Text style={styles.pillButtonText}>＋ Thêm thuốc</Text>
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
  debugRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugLabel: { fontSize: 12, color: '#666', marginRight: 8 },
  debugValue: { fontSize: 12, color: '#000', flex: 1 },
  errorBox: {
    padding: 12,
    backgroundColor: '#fee',
    borderRadius: 8,
    margin: 12,
  },
  errorTitle: { fontWeight: '700', color: '#900', marginBottom: 4 },
  errorText: { color: '#900' },
  errorSmall: { color: '#666', fontSize: 12, marginTop: 6 },
  errorPayload: { maxHeight: 120, marginTop: 6 },
  retry: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  retryText: { color: '#fff', fontWeight: '600' },
  listContainer: {
    flex: 9,
    paddingHorizontal: 8,
  },

  headerRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    paddingHorizontal: 6,
    minWidth: 0,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },

  bottomBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  pillButton: {
    width: '90%',
    backgroundColor: '#2EB872',
    paddingVertical: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  pillButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  error: { color: 'red', marginBottom: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666', padding: 20 },
});

export default MedicineListScreen;
