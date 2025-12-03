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
import { StatsGrid, StatsSection } from '../components/StatCard';
import { FilterDateRange } from '../components/FilterDateRange';
import { useRevenueStats } from '../hooks/useBranchStatistics';

/**
 * Màn hình thống kê doanh thu chi nhánh
 */
export const RevenueStatsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    data,
    isLoading,
    error: queryError,
  } = useRevenueStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const handleFilterChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ScrollView style={styles.container}>
      <FilterDateRange onFilterChange={handleFilterChange} showPresets={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : data ? (
        <>
          <StatsSection title="Tổng Quan Doanh Thu">
            <StatsGrid
              stats={[
                {
                  title: 'Tổng Doanh Thu',
                  value: data.totalRevenue,
                  valueFormat: 'currency',
                  color: '#27ae60',
                },
                {
                  title: 'Giá Trị TB/Hóa Đơn',
                  value: data.averageInvoiceValue,
                  valueFormat: 'currency',
                  color: '#3498db',
                },
              ]}
              columns={2}
            />
          </StatsSection>

          <StatsSection title="Chi Tiết">
            <StatsGrid
              stats={[
                {
                  title: 'Số Hóa Đơn',
                  value: data.totalInvoices,
                  valueFormat: 'number',
                  color: '#e74c3c',
                },
                {
                  title: 'Số Lượng Bán Ra',
                  value: data.totalQuantity,
                  valueFormat: 'number',
                  color: '#9b59b6',
                },
                {
                  title: 'Tổng Giảm Giá',
                  value: data.totalDiscount,
                  valueFormat: 'currency',
                  color: '#f39c12',
                },
                {
                  title: 'Tổng Thuế',
                  value: data.totalTax,
                  valueFormat: 'currency',
                  color: '#1abc9c',
                },
              ]}
              columns={2}
            />
          </StatsSection>
        </>
      ) : null}

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
