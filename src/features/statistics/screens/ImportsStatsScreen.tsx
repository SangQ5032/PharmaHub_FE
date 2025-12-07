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
import { useImportsStats } from '../hooks/useBranchStatistics';

/**
 * Màn hình thống kê lô hàng đã nhập
 */
export const ImportsStatsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    data,
    isLoading,
    error: queryError,
  } = useImportsStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleFilterChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const columns: TableColumn[] = [
    {
      key: 'medicineName',
      label: 'Tên Thuốc',
      width: 1.3,
    },
    {
      key: 'batchNumber',
      label: 'Mã Lô',
      width: 1,
    },
    {
      key: 'quantity',
      label: 'Số Lượng',
      format: 'number',
      align: 'center',
    },
    {
      key: 'unitPrice',
      label: 'Giá/Đơn',
      format: 'currency',
      align: 'right',
      width: 1,
    },
    {
      key: 'totalCost',
      label: 'Tổng Chi Phí',
      format: 'currency',
      align: 'right',
      width: 1.2,
    },
    {
      key: 'supplierName',
      label: 'Nhà Cung Cấp',
      width: 1.2,
    },
    {
      key: 'expiryDate',
      label: 'HSD',
      format: 'date',
      width: 1,
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
      ) : data && data.data && data.data.length > 0 ? (
        <StatsSection title={`Lịch Sử Nhập Hàng`}>
          <StatTable
            data={data.data}
            columns={columns}
            emptyMessage="Không có dữ liệu nhập hàng"
            pageSize={10}
          />
        </StatsSection>
      ) : (
        <StatsSection title="Lịch Sử Nhập Hàng">
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
