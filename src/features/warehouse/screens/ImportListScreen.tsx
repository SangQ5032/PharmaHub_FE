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
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useGetImports,
  useCancelImport,
} from '@features/warehouse/hooks/useImports';
import { ImportCard } from '@features/warehouse/components/ImportCard';
import { ImportRecord } from '@features/warehouse/types/import.types';
import { ROUTES } from '@shared/constants/routes';

export default function ImportListScreen() {
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'completed' | 'cancelled'
  >('all');

  // Fetch danh sách phiếu nhập
  const queryParams = {
    page,
    limit: 20,
    ...(statusFilter !== 'all' && { status: statusFilter as any }),
  };
  const { data, isLoading, error, refetch } = useGetImports(queryParams);

  // Cancel import mutation
  const cancelImportMutation = useCancelImport();

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Handle press card
  const handlePressCard = (importRecord: ImportRecord) => {
    // Navigate to detail screen
    navigation.navigate(ROUTES.IMPORT_DETAIL || 'ImportDetail', {
      id: importRecord._id,
    });
  };

  // Handle cancel import
  const handleCancelImport = (importRecord: ImportRecord) => {
    if (importRecord.status === 'cancelled') {
      Alert.alert('Thông báo', 'Phiếu nhập này đã bị hủy');
      return;
    }

    Alert.prompt(
      'Hủy phiếu nhập',
      'Vui lòng nhập lý do hủy phiếu nhập',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: async (reason: string | undefined) => {
            if (!reason || !reason.trim()) {
              Alert.alert('Lỗi', 'Lý do hủy không được để trống');
              return;
            }

            try {
              await cancelImportMutation.mutateAsync({
                id: importRecord._id,
                body: { reason: reason.trim() },
              });
              Alert.alert('Thành công', 'Hủy phiếu nhập thành công');
            } catch (err: any) {
              Alert.alert('Lỗi', err.message || 'Không thể hủy phiếu nhập');
            }
          },
        },
      ],
      'plain-text',
    );
  };

  // Handle create new import
  const handleCreateImport = () => {
    navigation.navigate(ROUTES.CREATE_IMPORT);
  };

  // Render status filter buttons
  const renderStatusFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {(['all', 'pending', 'completed', 'cancelled'] as const).map(status => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            statusFilter === status && styles.filterButtonActive,
          ]}
          onPress={() => {
            setStatusFilter(status);
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.filterButtonText,
              statusFilter === status && styles.filterButtonTextActive,
            ]}
            numberOfLines={1}
          >
            {status === 'all'
              ? 'Tất cả'
              : status === 'pending'
              ? 'Chờ xử lý'
              : status === 'completed'
              ? 'Hoàn thành'
              : 'Đã hủy'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render item
  const renderItem = ({ item }: { item: ImportRecord }) => (
    <View style={styles.itemContainer}>
      <ImportCard import={item} onPress={() => handlePressCard(item)} />
      {item.status !== 'cancelled' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelImport(item)}
          disabled={cancelImportMutation.isPending}
        >
          <Text style={styles.cancelButtonText}>
            {cancelImportMutation.isPending ? 'Đang xử lý...' : 'Hủy phiếu'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
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

      {/* Status filters */}
      {renderStatusFilters()}

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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  filterContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
