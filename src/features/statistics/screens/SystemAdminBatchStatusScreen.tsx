/**
 * SystemAdminBatchStatusScreen - Current inventory and batch status
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useSystemAdminBatchStatus } from '../hooks/useSystemAdminStats';
import { formatNumber } from '../utils/system-admin.utils';

interface BatchStatusScreenProps {
  navigation: any;
}

const SystemAdminBatchStatusScreen: React.FC<BatchStatusScreenProps> = ({
  navigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'expired' | 'expiring' | 'outofstock'
  >('all');

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminBatchStatus();

  // Filter batches
  const filteredBatches = React.useMemo(() => {
    let batches = data?.data?.details || [];

    // Filter by search
    if (searchQuery) {
      batches = batches.filter(
        b =>
          b.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false ||
          b.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false,
      );
    } // Filter by status
    switch (statusFilter) {
      case 'expired':
        return batches.filter(b => b.isExpired);
      case 'expiring':
        return batches.filter(
          b => !b.isExpired && b.expiryStatus === 'Sắp hết hạn',
        );
      case 'outofstock':
        return batches.filter(b => b.isOutOfStock);
      default:
        return batches;
    }
  }, [data, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  const summary = data?.data?.summary;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredBatches}
        keyExtractor={item => item._id}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Title */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Tình Trạng Tồn Kho</Text>

            {/* Summary Cards */}
            {summary && (
              <View style={styles.summaryGrid}>
                <View
                  style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}
                >
                  <Text style={styles.summaryLabel}>Còn Hàng</Text>
                  <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                    {formatNumber(summary.inStock)}
                  </Text>
                </View>

                <View
                  style={[styles.summaryCard, { backgroundColor: '#FFF3E0' }]}
                >
                  <Text style={styles.summaryLabel}>Sắp Hết Hạn</Text>
                  <Text style={[styles.summaryValue, { color: '#FF9800' }]}>
                    {formatNumber(summary.expiringSoon)}
                  </Text>
                </View>

                <View
                  style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]}
                >
                  <Text style={styles.summaryLabel}>Hết Hàng</Text>
                  <Text style={[styles.summaryValue, { color: '#f44336' }]}>
                    {formatNumber(summary.outOfStock)}
                  </Text>
                </View>

                <View
                  style={[styles.summaryCard, { backgroundColor: '#F3E5F5' }]}
                >
                  <Text style={styles.summaryLabel}>Hết Hạn</Text>
                  <Text style={[styles.summaryValue, { color: '#9C27B0' }]}>
                    {formatNumber(summary.expired)}
                  </Text>
                </View>
              </View>
            )}

            {/* Total Info */}
            {summary && (
              <View style={styles.totalInfo}>
                <Text style={styles.totalLabel}>Tổng Batch:</Text>
                <Text style={styles.totalValue}>
                  {formatNumber(summary.total)}
                </Text>
              </View>
            )}

            {/* Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm thuốc, batch, chi nhánh..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />

            {/* Status Filter */}
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  statusFilter === 'all' && styles.filterBtnActive,
                ]}
                onPress={() => setStatusFilter('all')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    statusFilter === 'all' && styles.filterBtnTextActive,
                  ]}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  statusFilter === 'expired' && styles.filterBtnActive,
                ]}
                onPress={() => setStatusFilter('expired')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    statusFilter === 'expired' && styles.filterBtnTextActive,
                  ]}
                >
                  Hết Hạn
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  statusFilter === 'expiring' && styles.filterBtnActive,
                ]}
                onPress={() => setStatusFilter('expiring')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    statusFilter === 'expiring' && styles.filterBtnTextActive,
                  ]}
                >
                  Sắp Hết
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  statusFilter === 'outofstock' && styles.filterBtnActive,
                ]}
                onPress={() => setStatusFilter('outofstock')}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    statusFilter === 'outofstock' && styles.filterBtnTextActive,
                  ]}
                >
                  Hết Hàng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const bgColor = '#fff';
          let statusColor = '#4CAF50';
          let statusBgColor = '#E8F5E9';

          if (item.isExpired) {
            statusColor = '#9C27B0';
            statusBgColor = '#F3E5F5';
          } else if (item.expiryStatus === 'Sắp hết hạn') {
            statusColor = '#FF9800';
            statusBgColor = '#FFF3E0';
          } else if (item.isOutOfStock) {
            statusColor = '#f44336';
            statusBgColor = '#FFEBEE';
          }

          return (
            <View style={styles.batchCard}>
              <View style={styles.batchHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusBgColor },
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {item.isExpired ? '❌' : item.isOutOfStock ? '⚠️' : '✓'}
                  </Text>
                </View>
                <View style={styles.batchInfo}>
                  <Text style={styles.medicineName}>{item.medicineName}</Text>
                  <Text style={styles.batchNumber}>
                    Chi nhánh: {item.branchName}
                  </Text>
                </View>
              </View>

              <View style={styles.batchDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Chi nhánh:</Text>
                  <Text style={styles.detailValue}>{item.branchName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tồn kho:</Text>
                  <Text style={[styles.detailValue, { fontWeight: '700' }]}>
                    {formatNumber(item.quantity)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Đã bán:</Text>
                  <Text style={styles.detailValue}>
                    {item.quantitySold !== null
                      ? formatNumber(item.quantitySold)
                      : '—'}
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <View
                  style={[styles.statusTag, { backgroundColor: statusBgColor }]}
                >
                  <Text style={[styles.statusTagText, { color: statusColor }]}>
                    Tồn kho: {item.stockStatus}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor: item.isExpired ? '#F3E5F5' : '#E8F5E9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      { color: item.isExpired ? '#9C27B0' : '#4CAF50' },
                    ]}
                  >
                    Hạn dùng: {item.expiryStatus}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {filteredBatches.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Không tìm thấy batch nào</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  totalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
    paddingRight: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 6,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  batchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  batchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 18,
  },
  batchInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  batchNumber: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  batchDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  statusTag: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SystemAdminBatchStatusScreen;
