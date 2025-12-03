import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatsSection } from '../components/StatCard';
import { FilterDateRange } from '../components/FilterDateRange';
import { StatTable, TableColumn } from '../components/StatTable';
import { useEmployeesStats } from '../hooks/useBranchStatistics';

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

  const columns: TableColumn[] = [
    {
      key: 'employeeName',
      label: 'Nhân Viên',
      width: 1.5,
    },
    {
      key: 'totalRevenue',
      label: 'Doanh Thu',
      format: 'currency',
      align: 'right',
      width: 1.2,
    },
    {
      key: 'totalOrders',
      label: 'Số Đơn',
      format: 'number',
      align: 'center',
    },
    {
      key: 'totalQuantity',
      label: 'Số Lượng',
      format: 'number',
      align: 'center',
    },
    {
      key: 'averageOrderValue',
      label: 'TB/Đơn',
      format: 'currency',
      align: 'right',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <FilterDateRange onFilterChange={handleFilterChange} showPresets={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : data && data.length > 0 ? (
        <StatsSection title={`Doanh Thu Nhân Viên`}>
          <StatTable
            data={data}
            columns={columns}
            emptyMessage="Không có dữ liệu nhân viên"
            pageSize={10}
          />
        </StatsSection>
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
