import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import useCategories from '../hooks/useCategories';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import DeleteConfirm from './DeleteConfirm';
import { deleteCategory } from '../services/categoriesService';
import { ROUTES } from '@shared/constants/routes';

const CategoriesList: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    items,
    loading,
    error,
    refresh,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    total,
    totalPages,
  } = useCategories({
    initialPage: 1,
    initialLimit: 10,
    initialSort: 'name_asc',
  });

  const [delId, setDelId] = useState<string | null>(null);
  const [delName, setDelName] = useState<string | undefined>(undefined);
  const [confirming, setConfirming] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const onToggleSortByName = () => {
    setSort(sort === 'name_asc' ? 'name_desc' : 'name_asc');
    setPage(1);
  };

  const headerSortIcon = useMemo(() => {
    if (sort === 'name_asc') return '↑';
    if (sort === 'name_desc') return '↓';
    return '';
  }, [sort]);

  const openDelete = (item: any) => {
    setDelId(String(item._id));
    setDelName(item?.name);
  };

  const doDelete = async () => {
    if (!delId) return;
    setConfirming(true);
    try {
      await deleteCategory(delId);
      setDelId(null);
      setDelName(undefined);
      refresh();
    } catch (e) {
      // noop, UI hiển thị lại bình thường
    } finally {
      setConfirming(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemRow}>
      <View style={[styles.cell, { flex: 40 }]}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTES.CATEGORY_DETAIL as any, {
              categoryId: String(item._id),
            })
          }
        >
          <Text
            style={[styles.cellText, { color: '#1B5E20', fontWeight: '700' }]}
            numberOfLines={1}
          >
            {item?.name || '-'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.cell, { flex: 35 }]}>
        <Text style={[styles.cellText]} numberOfLines={1}>
          {item?.description || '-'}
        </Text>
      </View>
      <View style={[styles.cell, { flex: 25, alignItems: 'flex-end' }]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.edit]}
            onPress={() =>
              navigation.navigate(ROUTES.ADD_CATEGORY as any, {
                mode: 'edit',
                item,
              })
            }
          >
            <Text style={styles.actionText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.delete]}
            onPress={() => openDelete(item)}
          >
            <Text style={styles.actionText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <>
      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo tên danh mục..."
          style={styles.searchInput}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerCell}>
          <TouchableOpacity onPress={onToggleSortByName} activeOpacity={0.7}>
            <Text style={[styles.headerText, styles.left]}>
              TÊN {headerSortIcon}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCell}>
          <Text style={[styles.headerText, styles.left]}>MÔ TẢ</Text>
        </View>
        <View style={styles.headerCell}>
          <Text style={[styles.headerText, styles.right]}>HÀNH ĐỘNG</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>Lỗi: {String(error)}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item: any) => String(item._id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={
          items.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          ) : null
        }
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, page <= 1 && styles.disabledBtn]}
          onPress={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <Text style={styles.pageBtnText}>Trang trước</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Trang {page}
          {totalPages ? ` / ${totalPages}` : ''}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageBtn,
            totalPages && page >= totalPages ? styles.disabledBtn : undefined,
          ]}
          onPress={() => setPage(page + 1)}
          disabled={!!totalPages && page >= totalPages}
        >
          <Text style={styles.pageBtnText}>Trang sau</Text>
        </TouchableOpacity>

        <View style={{ width: 12 }} />

        {/* limit quick choices */}
        <TouchableOpacity
          style={[styles.limitBtn, limit === 10 && styles.limitBtnActive]}
          onPress={() => setLimit(10)}
        >
          <Text
            style={[styles.limitText, limit === 10 && styles.limitTextActive]}
          >
            10
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.limitBtn, limit === 20 && styles.limitBtnActive]}
          onPress={() => setLimit(20)}
        >
          <Text
            style={[styles.limitText, limit === 20 && styles.limitTextActive]}
          >
            20
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.limitBtn, limit === 50 && styles.limitBtnActive]}
          onPress={() => setLimit(50)}
        >
          <Text
            style={[styles.limitText, limit === 50 && styles.limitTextActive]}
          >
            50
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delete confirm */}
      <DeleteConfirm
        visible={!!delId}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc muốn xóa "${delName || ''}"?`}
        confirming={confirming}
        onConfirm={doDelete}
        onCancel={() => setDelId(null)}
      />

      {/* Bottom add button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.pillButton}
          onPress={() => navigation.navigate(ROUTES.ADD_CATEGORY as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.pillButtonText}>＋ Thêm danh mục</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  right: { textAlign: 'right' },
  error: { color: 'red', marginHorizontal: 12, marginBottom: 8 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#666', padding: 20 },
  bottomBar: { padding: 12 },
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
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  pageBtn: {
    backgroundColor: '#2EB872',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledBtn: { opacity: 0.5 },
  pageBtnText: { color: '#fff', fontWeight: '700' },
  pageInfo: { marginHorizontal: 10, color: '#333' },
  limitBtn: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  limitBtnActive: { backgroundColor: '#2EB872', borderColor: '#2EB872' },
  limitText: { color: '#333', fontWeight: '600' },
  limitTextActive: { color: '#fff' },
});

export default CategoriesList;
