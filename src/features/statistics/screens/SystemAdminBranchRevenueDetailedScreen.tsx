/**
 * SystemAdminBranchRevenueDetailedScreen - Danh sách chi nhánh với doanh thu chi tiết
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import { useSystemAdminBranchRevenueDetailed } from '../hooks/useSystemAdminStats';
import { FilterDateRange } from '../components';
import { formatCurrency, formatNumber } from '../utils/system-admin.utils';

interface BranchRevenueData {
  totalInvoices: number;
  totalQuantity: number;
  branchId: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  totalRevenue: number;
  totalDiscount: number;
  totalTax: number;
  averageInvoiceValue: number;
}

interface BranchRevenueDetailedScreenProps {
  navigation: any;
}

const SystemAdminBranchRevenueDetailedScreen: React.FC<
  BranchRevenueDetailedScreenProps
> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'invoices' | 'name'>(
    'revenue',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminBranchRevenueDetailed({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

  // Calculate total and filter branches
  const { filteredBranches, totalStats } = React.useMemo(() => {
    let branches = (data?.data || []) as BranchRevenueData[];

    // Filter by search
    if (searchQuery) {
      branches = branches.filter(
        b =>
          b.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false ||
          b.branchAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false ||
          b.branchPhone?.includes(searchQuery) ||
          false,
      );
    }

    // Sort
    branches.sort((a, b) => {
      let compareValue = 0;
      if (sortBy === 'revenue') {
        compareValue = a.totalRevenue - b.totalRevenue;
      } else if (sortBy === 'invoices') {
        compareValue = a.totalInvoices - b.totalInvoices;
      } else if (sortBy === 'name') {
        compareValue = a.branchName.localeCompare(b.branchName);
      }

      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    // Calculate totals
    const totals = branches.reduce(
      (acc, item) => ({
        revenue: acc.revenue + item.totalRevenue,
        invoices: acc.invoices + item.totalInvoices,
        quantity: acc.quantity + item.totalQuantity,
      }),
      { revenue: 0, invoices: 0, quantity: 0 },
    );

    return { filteredBranches: branches, totalStats: totals };
  }, [data, searchQuery, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>❌ Lỗi tải dữ liệu</Text>
          <Text style={styles.errorMessage}>
            {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredBranches}
        keyExtractor={item => item.branchId}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>← Quay lại</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Doanh Thu Chi Nhánh</Text>

            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
              <View
                style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}
              >
                <Text style={styles.summaryLabel}>Tổng Doanh Thu</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  {formatCurrency(totalStats.revenue)}
                </Text>
              </View>

              <View
                style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}
              >
                <Text style={styles.summaryLabel}>Tổng Hóa Đơn</Text>
                <Text style={[styles.summaryValue, { color: '#2196F3' }]}>
                  {formatNumber(totalStats.invoices)}
                </Text>
              </View>

              <View
                style={[styles.summaryCard, { backgroundColor: '#F3E5F5' }]}
              >
                <Text style={styles.summaryLabel}>Tổng Số Lượng</Text>
                <Text style={[styles.summaryValue, { color: '#9C27B0' }]}>
                  {formatNumber(totalStats.quantity)}
                </Text>
              </View>
            </View>

            {/* Date Range Filter */}
            <FilterDateRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={(start, end) => {
                setDateRange({ startDate: start, endDate: end });
              }}
            />

            {/* Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm chi nhánh, địa chỉ, SĐT..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />

            {/* Sort Options */}
            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortBy === 'revenue' && styles.sortBtnActive,
                ]}
                onPress={() => {
                  if (sortBy === 'revenue') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('revenue');
                    setSortOrder('desc');
                  }
                }}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    sortBy === 'revenue' && styles.sortBtnTextActive,
                  ]}
                >
                  💰 Doanh Thu{' '}
                  {sortBy === 'revenue' && (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortBy === 'invoices' && styles.sortBtnActive,
                ]}
                onPress={() => {
                  if (sortBy === 'invoices') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('invoices');
                    setSortOrder('desc');
                  }
                }}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    sortBy === 'invoices' && styles.sortBtnTextActive,
                  ]}
                >
                  📄 Hóa Đơn{' '}
                  {sortBy === 'invoices' && (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortBtn,
                  sortBy === 'name' && styles.sortBtnActive,
                ]}
                onPress={() => {
                  if (sortBy === 'name') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('name');
                    setSortOrder('asc');
                  }
                }}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    sortBy === 'name' && styles.sortBtnTextActive,
                  ]}
                >
                  A-Z {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SystemAdminBranchRevenueDetail', {
                branchId: item.branchId,
                branchName: item.branchName,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              });
            }}
            style={styles.branchCard}
          >
            <View style={styles.branchHeader}>
              <View
                style={[
                  styles.rankBadge,
                  index === 0
                    ? { backgroundColor: '#FFD700' }
                    : index === 1
                    ? { backgroundColor: '#C0C0C0' }
                    : index === 2
                    ? { backgroundColor: '#CD7F32' }
                    : { backgroundColor: '#E0E0E0' },
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    index < 3 ? { color: '#fff' } : { color: '#666' },
                  ]}
                >
                  #{index + 1}
                </Text>
              </View>

              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{item.branchName}</Text>
                <Text style={styles.branchAddress} numberOfLines={1}>
                  📍 {item.branchAddress}
                </Text>
                {item.branchPhone && (
                  <Text style={styles.branchPhone}>📞 {item.branchPhone}</Text>
                )}
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Doanh Thu</Text>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                  {formatCurrency(item.totalRevenue)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Hóa Đơn</Text>
                <Text style={[styles.statValue, { color: '#2196F3' }]}>
                  {formatNumber(item.totalInvoices)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Số Lượng</Text>
                <Text style={[styles.statValue, { color: '#FF9800' }]}>
                  {formatNumber(item.totalQuantity)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Trung Bình</Text>
                <Text style={[styles.statValue, { color: '#9C27B0' }]}>
                  {formatCurrency(item.averageInvoiceValue)}
                </Text>
              </View>
            </View>

            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giảm giá:</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(item.totalDiscount)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Thuế:</Text>
                <Text style={styles.infoValue}>
                  {formatCurrency(item.totalTax)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />

      {filteredBranches.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'Không tìm thấy chi nhánh nào' : 'Không có dữ liệu'}
          </Text>
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  branchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    lineHeight: 16,
  },
  branchPhone: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  additionalInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
});

export default SystemAdminBranchRevenueDetailedScreen;
