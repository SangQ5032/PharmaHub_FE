import React from 'react';
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
import { StatTable, TableColumn } from '../components/StatTable';
import { useBatchStatusStats } from '../hooks/useBranchStatistics';

/**
 * Màn hình thống kê tình trạng lô hàng
 */
export const BatchStatusStatsScreen: React.FC = () => {
  const { data, isLoading, error } = useBatchStatusStats();

  const statusColumns: TableColumn[] = [
    {
      key: 'batchNumber',
      label: 'Mã Lô',
      width: 1,
    },
    {
      key: 'medicineName',
      label: 'Tên Thuốc',
      width: 1.3,
    },
    {
      key: 'quantity',
      label: 'Tồn Kho',
      format: 'number',
      align: 'center',
    },
    {
      key: 'stockStatus',
      label: 'Trạng Thái',
      width: 1,
    },
    {
      key: 'expiryDate',
      label: 'HSD',
      format: 'date',
      width: 1,
    },
    {
      key: 'expiryStatus',
      label: 'HSD Trạng Thái',
      width: 1.2,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : data ? (
        <>
          <StatsSection title="Tóm Tắt Tình Trạng">
            <StatsGrid
              stats={[
                {
                  title: 'Tổng Lô',
                  value: data.summary.total,
                  valueFormat: 'number',
                  color: '#34495e',
                },
                {
                  title: 'Còn Hàng',
                  value: data.summary.inStock,
                  valueFormat: 'number',
                  color: '#27ae60',
                },
                {
                  title: 'Hết Hàng',
                  value: data.summary.outOfStock,
                  valueFormat: 'number',
                  color: '#e74c3c',
                },
                {
                  title: 'Hết Hạn',
                  value: data.summary.expired,
                  valueFormat: 'number',
                  color: '#c0392b',
                },
                {
                  title: 'Sắp Hết Hạn',
                  subtitle: '≤ 30 ngày',
                  value: data.summary.expiringSoon,
                  valueFormat: 'number',
                  color: '#f39c12',
                },
                {
                  title: 'Còn Hạn',
                  subtitle: '> 30 ngày',
                  value: data.summary.valid,
                  valueFormat: 'number',
                  color: '#16a085',
                },
              ]}
              columns={2}
            />
          </StatsSection>

          <StatsSection title={`Chi Tiết Lô Hàng (${data.details.length})`}>
            <StatTable
              data={data.details}
              columns={statusColumns}
              emptyMessage="Không có lô hàng"
              pageSize={10}
            />
          </StatsSection>

          {/* Critical Batches Section */}
          {data.details.some(b => b.isExpired || b.quantity === 0) && (
            <StatsSection title="⚠️ Các Lô Hàng Cần Lưu Ý">
              <StatTable
                data={data.details.filter(b => b.isExpired || b.quantity === 0)}
                columns={statusColumns}
                emptyMessage="Không có lô hàng cần lưu ý"
                pageSize={10}
              />
            </StatsSection>
          )}
        </>
      ) : null}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || 'Lỗi tải dữ liệu'}
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
