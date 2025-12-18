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
import { useImportsStats } from '../hooks/useBranchStatistics';
import { StatInsightList } from '../components/StatInsightList';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

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

  const rows = data?.data || [];
  const totalCost = rows.reduce(
    (sum: number, r: any) => sum + Number(r?.totalCost || 0),
    0,
  );
  const totalQuantity = rows.reduce(
    (sum: number, r: any) => sum + Number(r?.quantity || 0),
    0,
  );

  const supplierTotals: Record<string, number> = rows.reduce(
    (acc: Record<string, number>, r: any) => {
      const key = String(r?.supplierName || 'Không rõ');
      acc[key] = (acc[key] || 0) + Number(r?.totalCost || 0);
      return acc;
    },
    {},
  );
  const topSuppliers = Object.entries(supplierTotals)
    .map(([name, cost]) => ({ name, cost }))
    .sort((a, b) => b.cost - a.cost);

  return (
    <ScrollView style={styles.container}>
      <FilterDateRange onFilterChange={handleFilterChange} showPresets={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : rows.length > 0 ? (
        <>
          <StatsSection title="Tổng quan">
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Số lô nhập</Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(rows.length)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng số lượng nhập</Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(totalQuantity)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng chi phí</Text>
                <Text style={styles.summaryValueGreen}>
                  {formatCurrency(totalCost)}
                </Text>
              </View>
            </View>
          </StatsSection>

          <StatsSection title="Top nhà cung cấp theo chi phí">
            <StatInsightList
              items={topSuppliers.map((s, idx) => ({
                id: `supplier-${s.name}-${idx}`,
                title: s.name,
                rank: idx + 1,
                rightText: String(s.cost),
                rightTextFormat: 'currency',
              }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu nhà cung cấp"
            />
          </StatsSection>

          <StatsSection title="Các lô nhập gần đây">
            <StatInsightList
              items={[...rows]
                .sort((a: any, b: any) => {
                  const ad = new Date(
                    a?.createdAt || a?.importDate || 0,
                  ).getTime();
                  const bd = new Date(
                    b?.createdAt || b?.importDate || 0,
                  ).getTime();
                  return bd - ad;
                })
                .map((r: any, idx: number) => ({
                  id: String(r?.importId || r?._id || r?.batchNumber || idx),
                  title: r?.medicineName || 'Không rõ',
                  subtitle: r?.batchNumber
                    ? `Mã lô: ${r.batchNumber}`
                    : undefined,
                  rightText: String(r?.totalCost ?? 0),
                  rightTextFormat: 'currency',
                  rows: [
                    { label: 'Số lượng', value: r?.quantity, format: 'number' },
                    {
                      label: 'Giá/đơn',
                      value: r?.unitPrice,
                      format: 'currency',
                    },
                    {
                      label: 'Nhà cung cấp',
                      value: r?.supplierName,
                      format: 'text',
                    },
                    { label: 'HSD', value: r?.expiryDate, format: 'date' },
                  ],
                }))}
              initialVisible={6}
              emptyMessage="Không có dữ liệu nhập hàng"
            />
          </StatsSection>
        </>
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
