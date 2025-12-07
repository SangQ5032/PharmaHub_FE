/**
 * SystemAdminBranchRevenueScreen - Detailed branch revenue comparison
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSystemAdminBranchRevenue } from '../hooks/useSystemAdminStats';
import { FilterDateRange, StatTable } from '../components';
import {
  formatCurrency,
  formatNumber,
  getCurrentMonthDateRange,
  formatDateForAPI,
} from '../utils/system-admin.utils';

interface BranchRevenueScreenProps {
  navigation: any;
  route?: any;
}

const SystemAdminBranchRevenueScreen: React.FC<BranchRevenueScreenProps> = ({
  navigation,
  route,
}) => {
  const routeParams = route?.params || {};
  const { startDate: defaultStart, endDate: defaultEnd } =
    getCurrentMonthDateRange();

  const [startDate, setStartDate] = useState(
    routeParams.startDate || defaultStart,
  );
  const [endDate, setEndDate] = useState(routeParams.endDate || defaultEnd);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'invoices' | 'name'>(
    'revenue',
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminBranchRevenue({
      startDate,
      endDate,
    });

  const handleDateChange = (type: 'start' | 'end', date?: Date) => {
    if (!date) {
      if (type === 'start') setShowStartPicker(false);
      else setShowEndPicker(false);
      return;
    }

    const formattedDate = formatDateForAPI(date);
    if (type === 'start') {
      setStartDate(formattedDate);
      setShowStartPicker(false);
    } else {
      setEndDate(formattedDate);
      setShowEndPicker(false);
    }
  };

  // Filter and sort branches
  const processedBranches = useMemo(() => {
    let branches = [...(data?.data || [])];

    // Filter by search query
    if (searchQuery) {
      branches = branches.filter(
        branch =>
          branch.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.branchAddress
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Sort
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    branches.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return (a.totalRevenue - b.totalRevenue) * multiplier;
        case 'invoices':
          return (a.totalInvoices - b.totalInvoices) * multiplier;
        case 'name':
          return a.branchName.localeCompare(b.branchName) * multiplier;
        default:
          return 0;
      }
    });

    return branches;
  }, [data, searchQuery, sortBy, sortOrder]);

  // Calculate totals
  const totals = useMemo(() => {
    return processedBranches.reduce(
      (acc, branch) => ({
        totalRevenue: acc.totalRevenue + branch.totalRevenue,
        totalInvoices: acc.totalInvoices + branch.totalInvoices,
        totalQuantity: acc.totalQuantity + branch.totalQuantity,
        averageRevenue:
          acc.averageRevenue + branch.totalRevenue / processedBranches.length,
      }),
      {
        totalRevenue: 0,
        totalInvoices: 0,
        totalQuantity: 0,
        averageRevenue: 0,
      },
    );
  }, [processedBranches]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={processedBranches}
        keyExtractor={item => item.branchId}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Title */}
            <View style={styles.titleSection}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backBtn}>← Quay lại</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Doanh Thu Chi Nhánh</Text>
            </View>

            {/* Date Range Filter */}
            <FilterDateRange
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={() => setShowStartPicker(true)}
              onEndDateChange={() => setShowEndPicker(true)}
            />

            {/* Summary Stats */}
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Tổng Doanh Thu</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(totals.totalRevenue)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Trung Bình</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(totals.averageRevenue)}
                </Text>
              </View>
            </View>

            {/* Search Bar */}
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm chi nhánh..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />

            {/* Sort Options */}
            <View style={styles.sortOptions}>
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
                  Doanh Thu{' '}
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
                  Hóa Đơn{' '}
                  {sortBy === 'invoices' && (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <View style={styles.branchRank}>
                <Text style={styles.branchRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{item.branchName}</Text>
                <Text style={styles.branchAddress}>{item.branchAddress}</Text>
              </View>
            </View>

            <View style={styles.branchStats}>
              <View style={styles.branchStatItem}>
                <Text style={styles.statLabel}>Doanh Thu</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(item.totalRevenue)}
                </Text>
              </View>

              <View style={styles.branchStatItem}>
                <Text style={styles.statLabel}>Hóa Đơn</Text>
                <Text style={styles.statValue}>
                  {formatNumber(item.totalInvoices)}
                </Text>
              </View>

              <View style={styles.branchStatItem}>
                <Text style={styles.statLabel}>Qty</Text>
                <Text style={styles.statValue}>
                  {formatNumber(item.totalQuantity)}
                </Text>
              </View>

              <View style={styles.branchStatItem}>
                <Text style={styles.statLabel}>Avg</Text>
                <Text style={styles.statValue}>
                  {formatCurrency(item.averageInvoiceValue)}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={new Date(startDate)}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange('start', date)}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={new Date(endDate)}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange('end', date)}
        />
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
  },
  titleSection: {
    marginBottom: 16,
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
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
  },
  sortBtnActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  branchCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  branchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  branchRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  branchRankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  branchAddress: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  branchStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  branchStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
});

export default SystemAdminBranchRevenueScreen;
