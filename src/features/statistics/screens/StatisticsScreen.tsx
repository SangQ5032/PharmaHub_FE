import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useStatistics } from '../hooks/useStatistics';
import {
  StatisticsCard,
  FilterBar,
  ChartComponent,
  DetailedTable,
} from '../components';
import { GroupBy } from '../types';

interface StatisticsScreenProps {
  navigation?: any;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [groupBy, setGroupBy] = useState<GroupBy>('month');
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useStatistics({
    startDate,
    endDate,
    groupBy,
  });

  const handleFilterChange = (
    newStartDate?: Date,
    newEndDate?: Date,
    newGroupBy?: GroupBy,
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    if (newGroupBy) setGroupBy(newGroupBy);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const summary = data?.data?.summary;
  const periods = data?.data?.periods || [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thống Kê Doanh Thu</Text>
          <Text style={styles.headerSubtitle}>
            Xem chi tiết doanh thu của bạn
          </Text>
        </View>

        {/* Filter Bar */}
        <View style={styles.content}>
          <FilterBar
            onFilterChange={handleFilterChange}
            defaultGroupBy={groupBy}
          />

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ Có lỗi khi tải dữ liệu</Text>
              <Text style={styles.errorDetails}>{error.message}</Text>
            </View>
          )}

          {/* Summary Cards */}
          {summary && !isLoading && (
            <View>
              <StatisticsCard
                title="Tổng Doanh Thu"
                value={summary.totalRevenue}
                icon="📊"
                type="currency"
                color="#007AFF"
              />
              <StatisticsCard
                title="Tổng Số Lượng Bán"
                value={summary.totalQuantitySold}
                icon="📦"
                type="number"
                color="#34C759"
              />
              <StatisticsCard
                title="Tổng Giao Dịch"
                value={summary.totalTransactions}
                icon="💳"
                type="transaction"
                color="#FF9500"
              />
              <StatisticsCard
                title="Trung Bình/Giao Dịch"
                value={summary.averageTransaction}
                icon="💰"
                type="currency"
                color="#FF3B30"
              />
            </View>
          )}

          {/* Chart */}
          {periods.length > 0 && !isLoading && (
            <ChartComponent data={periods} groupBy={groupBy} />
          )}

          {/* Detailed Table */}
          {periods.length > 0 && !isLoading && (
            <DetailedTable data={periods} groupBy={groupBy} />
          )}

          {/* Empty State */}
          {!isLoading && !error && periods.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📭</Text>
              <Text style={styles.emptyTitle}>Không có dữ liệu</Text>
              <Text style={styles.emptyDescription}>
                Hãy thử thay đổi khoảng thời gian hoặc cách nhóm dữ liệu
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  errorDetails: {
    fontSize: 12,
    color: '#D70015',
  },
  emptyContainer: {
    paddingVertical: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
