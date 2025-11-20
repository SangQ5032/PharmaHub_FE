// src/features/warehouse/screens/ImportListScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetImports } from '@features/warehouse/hooks/useImports';
import { ImportCard } from '@features/warehouse/components/ImportCard';
import { ImportRecord } from '@features/warehouse/types/import.types';
import { ROUTES } from '@shared/constants/routes';

export default function ImportListScreen() {
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch danh sách phiếu nhập
  const { data, isLoading, error, refetch } = useGetImports({
    page,
    limit: 20,
  });

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle press card
  const handlePressCard = (importRecord: ImportRecord) => {
    Alert.alert(
      'Chi tiết phiếu nhập',
      `ID: ${importRecord._id}\nNhà cung cấp: ${
        importRecord.supplier?.name || 'N/A'
      }`,
    );
    // TODO: Navigate to detail screen
    // navigation.navigate('ImportDetail', { id: importRecord._id });
  };

  // Handle create new import
  const handleCreateImport = () => {
    Alert.alert('Tạo phiếu nhập mới', 'Chức năng đang phát triển');
    // TODO: Navigate to create screen
    navigation.navigate(ROUTES.CREATE_IMPORT);
  };

  // Render item
  const renderItem = ({ item }: { item: ImportRecord }) => (
    <ImportCard import={item} onPress={() => handlePressCard(item)} />
  );

  // Render empty
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có phiếu nhập nào</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateImport}
      >
        <Text style={styles.createButtonText}>Tạo phiếu nhập mới</Text>
      </TouchableOpacity>
    </View>
  );

  // Render error
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Lỗi:{' '}
          {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách phiếu nhập</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateImport}>
          <Text style={styles.addButtonText}>+ Tạo mới</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
