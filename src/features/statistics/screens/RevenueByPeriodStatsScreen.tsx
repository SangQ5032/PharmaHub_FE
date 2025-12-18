import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextStyle,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { StatsSection } from '../components/StatCard';
import { FilterDateRange } from '../components/FilterDateRange';
import { useRevenueByPeriodStats } from '../hooks/useBranchStatistics';
import { useSystemAdminRevenueByPeriod } from '../hooks/useSystemAdminStats';
import { ROUTES } from '@shared/constants/routes';
import { StatInsightList } from '../components/StatInsightList';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

type GroupByType = 'day' | 'month' | 'year';

/**
 * Màn hình thống kê doanh thu theo thời gian
 * Hỗ trợ cả branch và system admin
 */
export const RevenueByPeriodStatsScreen: React.FC = () => {
  const route = useRoute();
  const isSystemAdmin =
    route.name === ROUTES.SYSTEM_ADMIN_REVENUE_BY_PERIOD ||
    route.name === 'SystemAdminRevenueByPeriod';

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupByType>('month');
  const [error, setError] = useState<string>('');

  // Hook cho branch
  const {
    data: branchData,
    isLoading: branchLoading,
    error: branchError,
  } = useRevenueByPeriodStats({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    groupBy,
  });

  // Hook cho system admin
  const {
    data: systemAdminData,
    isLoading: systemAdminLoading,
    error: systemAdminError,
  } = useSystemAdminRevenueByPeriod({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    groupBy,
  });

  // Chọn dữ liệu và loading state dựa trên context
  const { data, isLoading, queryError } = useMemo(() => {
    if (isSystemAdmin) {
      // System admin response có cấu trúc { success, message, data: [...] }
      return {
        data: systemAdminData?.data || [],
        isLoading: systemAdminLoading,
        queryError: systemAdminError,
      };
    } else {
      // Branch response có cấu trúc { data: [...] }
      return {
        data: branchData?.data || [],
        isLoading: branchLoading,
        queryError: branchError,
      };
    }
  }, [
    isSystemAdmin,
    branchData,
    systemAdminData,
    branchLoading,
    systemAdminLoading,
    branchError,
    systemAdminError,
  ]);

  const handleFilterChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getGroupByLabel = () => {
    switch (groupBy) {
      case 'day':
        return 'Kỳ/Ngày';
      case 'month':
        return 'Kỳ/Tháng';
      case 'year':
        return 'Kỳ/Năm';
    }
  };
  const totalRevenue = (data || []).reduce(
    (sum: number, r: any) => sum + Number(r?.totalRevenue || 0),
    0,
  );
  const totalOrders = (data || []).reduce(
    (sum: number, r: any) => sum + Number(r?.totalOrders || 0),
    0,
  );
  const maxRevenuePeriod = [...(data || [])].sort(
    (a: any, b: any) =>
      Number(b?.totalRevenue || 0) - Number(a?.totalRevenue || 0),
  )[0];

  return (
    <ScrollView style={styles.container}>
      <FilterDateRange onFilterChange={handleFilterChange} showPresets={true} />

      <StatsSection title="Nhóm Theo">
        <View style={styles.groupByButtons}>
          {(['day', 'month', 'year'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.groupByButton,
                groupBy === period && styles.groupByButtonActive,
              ]}
              onPress={() => setGroupBy(period)}
            >
              <Text
                style={[
                  styles.groupByButtonText,
                  groupBy === period && styles.groupByButtonTextActive,
                ]}
              >
                {period === 'day' && 'Ngày'}
                {period === 'month' && 'Tháng'}
                {period === 'year' && 'Năm'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </StatsSection>

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
                <Text style={styles.summaryLabel}>
                  Số kỳ (
                  {groupBy === 'day'
                    ? 'ngày'
                    : groupBy === 'month'
                    ? 'tháng'
                    : 'năm'}
                  )
                </Text>
                <Text style={styles.summaryValue}>
                  {formatNumber(data.length)}
                </Text>
              </View>
              {maxRevenuePeriod ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kỳ cao nhất</Text>
                  <Text style={styles.summaryValue}>
                    {String(maxRevenuePeriod?._id)} ·{' '}
                    {formatCurrency(
                      Number(maxRevenuePeriod?.totalRevenue || 0),
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
          </StatsSection>

          <StatsSection
            title={`Danh sách theo ${
              groupBy === 'day' ? 'ngày' : groupBy === 'month' ? 'tháng' : 'năm'
            }`}
          >
            <StatInsightList
              items={[...data]
                .sort((a: any, b: any) => {
                  // nếu _id có thể parse được date thì sort desc; fallback: sort theo chuỗi
                  const ad = new Date(a?._id).getTime();
                  const bd = new Date(b?._id).getTime();
                  if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
                  return String(b?._id || '').localeCompare(
                    String(a?._id || ''),
                  );
                })
                .map((r: any, idx: number) => ({
                  id: String(r?._id || idx),
                  title: `${getGroupByLabel()}: ${String(r?._id ?? 'N/A')}`,
                  rightText: String(r?.totalRevenue ?? 0),
                  rightTextFormat: 'currency',
                  rows: [
                    {
                      label: 'Số đơn',
                      value: r?.totalOrders,
                      format: 'number',
                    },
                    {
                      label: 'Số lượng',
                      value: r?.totalQuantity,
                      format: 'number',
                    },
                    {
                      label: 'Giảm giá',
                      value: r?.totalDiscount,
                      format: 'currency',
                    },
                    { label: 'Thuế', value: r?.totalTax, format: 'currency' },
                  ],
                }))}
              initialVisible={8}
              emptyMessage="Không có dữ liệu"
            />
          </StatsSection>
        </>
      ) : (
        <StatsSection title="Doanh Thu Theo Thời Gian">
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          </View>
        </StatsSection>
      )}

      {(queryError || error) && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {typeof queryError === 'string'
              ? queryError
              : queryError?.message || error || 'Lỗi tải dữ liệu'}
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
  groupByButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  groupByButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  groupByButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  groupByButtonText: {
    fontSize: 13,
    color: '#333',
  } as TextStyle,
  groupByButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
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
    gap: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    flex: 1,
  } as TextStyle,
  summaryValue: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '800',
  } as TextStyle,
  summaryValueGreen: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '800',
  } as TextStyle,
});
