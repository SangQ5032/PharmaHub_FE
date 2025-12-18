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
import { useEmployeesStats } from '../hooks/useBranchStatistics';
import { StatInsightList } from '../components/StatInsightList';
import { formatCurrency } from '@shared/utils/formatters';

/**
 * Màn hình thống kê doanh thu từng nhân viên
 */
export const EmployeesStatsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    data,
    isLoading,
    error: queryError,
  } = useEmployeesStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleFilterChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const totalRevenue = (data || []).reduce(
    (sum: number, e: any) => sum + Number(e?.totalRevenue || 0),
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
              <Text style={styles.summaryLabel}>
                Tổng doanh thu (theo nhân viên)
              </Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(totalRevenue)}
              </Text>
              <Text style={styles.summaryHint}>
                Hiển thị top theo doanh thu, chạm “Xem thêm” để xem toàn bộ.
              </Text>
            </View>
          </StatsSection>

          <StatsSection title={`Top nhân viên (${data.length})`}>
            <StatInsightList
              items={[...data]
                .sort(
                  (a: any, b: any) =>
                    Number(b?.totalRevenue || 0) - Number(a?.totalRevenue || 0),
                )
                .map((e: any, idx: number) => ({
                  id: String(e?.employeeId || e?._id || e?.employeeName || idx),
                  title: e?.employeeName || 'Không rõ',
                  rank: idx + 1,
                  rightText: String(e?.totalRevenue ?? 0),
                  rightTextFormat: 'currency',
                  rows: [
                    {
                      label: 'Số đơn',
                      value: e?.totalOrders,
                      format: 'number',
                    },
                    {
                      label: 'Số lượng',
                      value: e?.totalQuantity,
                      format: 'number',
                    },
                    {
                      label: 'TB/đơn',
                      value: e?.averageOrderValue,
                      format: 'currency',
                    },
                  ],
                }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu nhân viên"
            />
          </StatsSection>
        </>
      ) : (
        <StatsSection title="Doanh Thu Nhân Viên">
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
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  } as TextStyle,
  summaryValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    color: '#27ae60',
  } as TextStyle,
  summaryHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#95a5a6',
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
});
