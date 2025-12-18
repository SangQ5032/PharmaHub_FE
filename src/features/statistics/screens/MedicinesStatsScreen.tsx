import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
} from 'react-native';
import { StatsGrid, StatsSection } from '../components/StatCard';
import { FilterDateRange } from '../components/FilterDateRange';
import { useMedicinesStats } from '../hooks/useBranchStatistics';
import { StatInsightList } from '../components/StatInsightList';

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

          <StatsSection title="Top thuốc theo doanh thu">
            <StatInsightList
              items={[...(data.medicineDetails || [])]
                .sort(
                  (a: any, b: any) =>
                    Number(b?.totalRevenue || 0) - Number(a?.totalRevenue || 0),
                )
                .map((m: any, idx: number) => ({
                  id: String(m?.medicineId || m?._id || m?.medicineName || idx),
                  title: m?.medicineName || 'Không rõ',
                  rank: idx + 1,
                  rightText: String(m?.totalRevenue ?? 0),
                  rightTextFormat: 'currency',
                  rows: [
                    {
                      label: 'Số lượng bán',
                      value: m?.totalQuantity,
                      format: 'number',
                    },
                    {
                      label: 'Số lần',
                      value: m?.timesOrdered,
                      format: 'number',
                    },
                    {
                      label: 'Giá TB',
                      value: m?.averagePrice,
                      format: 'currency',
                    },
                  ],
                }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu thuốc"
            />
          </StatsSection>

          <StatsSection title="Top thuốc theo số lượng">
            <StatInsightList
              items={[...(data.medicineDetails || [])]
                .sort(
                  (a: any, b: any) =>
                    Number(b?.totalQuantity || 0) -
                    Number(a?.totalQuantity || 0),
                )
                .map((m: any, idx: number) => ({
                  id: `qty-${String(
                    m?.medicineId || m?._id || m?.medicineName || idx,
                  )}`,
                  title: m?.medicineName || 'Không rõ',
                  rank: idx + 1,
                  rightText: String(m?.totalQuantity ?? 0),
                  rightTextFormat: 'number',
                  rows: [
                    {
                      label: 'Doanh thu',
                      value: m?.totalRevenue,
                      format: 'currency',
                    },
                    {
                      label: 'Số lần',
                      value: m?.timesOrdered,
                      format: 'number',
                    },
                    {
                      label: 'Giá TB',
                      value: m?.averagePrice,
                      format: 'currency',
                    },
                  ],
                }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu thuốc"
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
