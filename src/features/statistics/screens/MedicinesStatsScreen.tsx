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
import { StatTable, TableColumn } from '../components/StatTable';
import { useMedicinesStats } from '../hooks/useBranchStatistics';

/**
 * Màn hình thống kê bán hàng theo thuốc
 */
export const MedicinesStatsScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const {
    data,
    isLoading,
    error: queryError,
  } = useMedicinesStats({
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
      width: 1.5,
    },
    {
      key: 'totalQuantity',
      label: 'Số Lượng Bán',
      format: 'number',
      align: 'center',
    },
    {
      key: 'totalRevenue',
      label: 'Doanh Thu',
      format: 'currency',
      align: 'right',
      width: 1.2,
    },
    {
      key: 'timesOrdered',
      label: 'Số Lần',
      format: 'number',
      align: 'center',
    },
    {
      key: 'averagePrice',
      label: 'Giá TB',
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
      ) : data ? (
        <>
          <StatsSection title="Tổng Quan Bán Hàng">
            <StatsGrid
              stats={[
                {
                  title: 'Tổng Loại Thuốc',
                  value: data.overall.totalMedicineTypes,
                  valueFormat: 'number',
                  color: '#e74c3c',
                },
                {
                  title: 'Số Lượng Bán',
                  value: data.overall.totalQuantity,
                  valueFormat: 'number',
                  color: '#3498db',
                },
                {
                  title: 'Tổng Doanh Thu',
                  value: data.overall.totalRevenue,
                  valueFormat: 'currency',
                  color: '#27ae60',
                },
              ]}
              columns={3}
            />
          </StatsSection>

          <StatsSection
            title={`Chi Tiết Thuốc (${data.medicineDetails.length})`}
          >
            <StatTable
              data={data.medicineDetails}
              columns={columns}
              emptyMessage="Không có dữ liệu thuốc"
              pageSize={10}
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
