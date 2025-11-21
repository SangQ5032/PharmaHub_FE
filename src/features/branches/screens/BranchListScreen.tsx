import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useBranches, useDeleteBranch } from '../hooks/useBranches';
import BranchItem from '../components/BranchItem';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

const PAGE_SIZE = 10;

const BranchListEmpty: React.FC = () => (
  <View style={styles.empty}>
    <Text>Không có chi nhánh.</Text>
  </View>
);

const BranchListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data, isLoading, isError } = useBranches();
  const deleteMut = useDeleteBranch();

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (!query) return list;
    return list.filter((b: any) =>
      b.name?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const onAdd = () =>
    navigation.navigate(ROUTES.ADD_EDIT_BRANCH, { mode: 'create' });

  const confirmDelete = (item: any) => {
    Alert.alert('Xác nhận', `Bạn có muốn xóa chi nhánh "${item.name}" không?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMut.mutateAsync(item._id);
          } catch (err: any) {
            Alert.alert('Lỗi', err?.message || 'Xóa thất bại');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải danh sách chi nhánh.</Text>
        <Button title="Thử lại" onPress={() => setPage(1)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách chi nhánh</Text>
        <Button title="Thêm" onPress={onAdd} />
      </View>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Tìm theo tên..."
          style={styles.searchInput}
          value={query}
          onChangeText={text => {
            setQuery(text);
            setPage(1);
          }}
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <BranchItem
            item={item}
            onPress={() =>
              navigation.navigate(ROUTES.BRANCH_DETAIL, {
                branchId: item._id,
                branchName: item.name,
              })
            }
            onDelete={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={BranchListEmpty}
      />

      <View style={styles.pagination}>
        <Button
          title="Trước"
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        <Text style={styles.pageText}>{`${page} / ${totalPages}`}</Text>
        <Button
          title="Tiếp"
          onPress={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: '700' },
  searchRow: {
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  pageText: { fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { padding: 20, alignItems: 'center' },
});

export default BranchListScreen;
