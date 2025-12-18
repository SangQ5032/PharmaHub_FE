import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
} from 'react-native';
import { StatsGrid, StatsSection } from '../components/StatCard';
import { useBatchStatusStats } from '../hooks/useBranchStatistics';
import { StatInsightList } from '../components/StatInsightList';

/**
 * Màn hình thống kê tình trạng lô hàng
 */
export const BatchStatusStatsScreen: React.FC = () => {
  const { data, isLoading, error } = useBatchStatusStats();

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

          <StatsSection title="⚠️ Các lô cần lưu ý">
            <StatInsightList
              items={(data.details || [])
                .filter(
                  (b: any) =>
                    b?.isExpired ||
                    Number(b?.quantity || 0) === 0 ||
                    b?.isExpiringSoon,
                )
                .sort((a: any, b: any) => {
                  // ưu tiên: hết hạn -> hết hàng -> sắp hết hạn
                  const score = (x: any) =>
                    x?.isExpired
                      ? 3
                      : Number(x?.quantity || 0) === 0
                      ? 2
                      : x?.isExpiringSoon
                      ? 1
                      : 0;
                  return score(b) - score(a);
                })
                .map((b: any, idx: number) => ({
                  id: String(b?.batchId || b?._id || b?.batchNumber || idx),
                  title: b?.medicineName || 'Không rõ',
                  subtitle: b?.batchNumber
                    ? `Mã lô: ${b.batchNumber}`
                    : undefined,
                  badges: [
                    b?.isExpired
                      ? {
                          text: 'HẾT HẠN',
                          color: '#fff',
                          backgroundColor: '#c0392b',
                        }
                      : null,
                    Number(b?.quantity || 0) === 0
                      ? {
                          text: 'HẾT HÀNG',
                          color: '#fff',
                          backgroundColor: '#e74c3c',
                        }
                      : null,
                    b?.isExpiringSoon
                      ? {
                          text: 'SẮP HẾT HẠN',
                          color: '#7a4f01',
                          backgroundColor: '#fdebd0',
                        }
                      : null,
                  ].filter(Boolean) as any,
                  rows: [
                    { label: 'Tồn kho', value: b?.quantity, format: 'number' },
                    {
                      label: 'Trạng thái',
                      value: b?.stockStatus,
                      format: 'text',
                    },
                    { label: 'HSD', value: b?.expiryDate, format: 'date' },
                    {
                      label: 'Trạng thái HSD',
                      value: b?.expiryStatus,
                      format: 'text',
                    },
                  ],
                }))}
              initialVisible={8}
              emptyMessage="Không có lô hàng cần lưu ý"
            />
          </StatsSection>
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
