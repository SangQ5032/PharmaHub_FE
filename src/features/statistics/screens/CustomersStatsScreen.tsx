import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
} from 'react-native';
import { StatsSection } from '../components/StatCard';
import { FilterDateRange } from '../components/FilterDateRange';
import { useCustomersStats } from '../hooks/useBranchStatistics';
import { StatInsightList } from '../components/StatInsightList';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

/**
 * Màn hình thống kê doanh thu theo khách hàng
 */
export const CustomersStatsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    data,
    isLoading,
    error: queryError,
  } = useCustomersStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleFilterChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const totalRevenue = (data || []).reduce(
    (sum: number, c: any) => sum + Number(c?.totalRevenue || 0),
    0,
  );
  const totalOrders = (data || []).reduce(
    (sum: number, c: any) => sum + Number(c?.totalOrders || 0),
    0,
  );

  return (
    <ScrollView style={styles.container}>
      <FilterDateRange onFilterChange={handleFilterChange} showPresets={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : data && data.length > 0 ? (
        <>
          <StatsSection title="Tổng quan">
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
                <Text style={styles.summaryValueGreen}>
                  {formatCurrency(totalRevenue)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng số đơn</Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(totalOrders)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Số khách có phát sinh</Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(data.length)}
                </Text>
              </View>
            </View>
          </StatsSection>

          <StatsSection title="Top khách hàng theo doanh thu">
            <StatInsightList
              items={[...data]
                .sort(
                  (a: any, b: any) =>
                    Number(b?.totalRevenue || 0) - Number(a?.totalRevenue || 0),
                )
                .map((c: any, idx: number) => ({
                  id: String(
                    c?.customerId || c?._id || c?.customerPhone || idx,
                  ),
                  title: c?.customerName || 'Không rõ',
                  subtitle: c?.customerPhone
                    ? `SĐT: ${c.customerPhone}`
                    : undefined,
                  rank: idx + 1,
                  rightText: String(c?.totalRevenue ?? 0),
                  rightTextFormat: 'currency',
                  rows: [
                    {
                      label: 'Số đơn',
                      value: c?.totalOrders,
                      format: 'number',
                    },
                    {
                      label: 'Số lượng',
                      value: c?.totalQuantity,
                      format: 'number',
                    },
                    {
                      label: 'TB/đơn',
                      value: c?.averageOrderValue,
                      format: 'currency',
                    },
                    {
                      label: 'Mua gần nhất',
                      value: c?.lastOrderDate,
                      format: 'date',
                    },
                  ],
                }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu khách hàng"
            />
          </StatsSection>
        </>
      ) : (
        <StatsSection title="Doanh Thu Khách Hàng">
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          </View>
        </StatsSection>
      )}

      {(queryError || error) && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {queryError || error || 'Lỗi tải dữ liệu'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7f8c8d',
  } as TextStyle,
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  } as TextStyle,
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
  } as TextStyle,
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  } as TextStyle,
  summaryValue: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '800',
  } as TextStyle,
  summaryValueGreen: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: '800',
  } as TextStyle,
});
