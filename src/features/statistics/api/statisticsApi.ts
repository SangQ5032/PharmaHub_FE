import { apiClient } from '@shared/services/api';
import {
  StatisticsQueryParams,
  StatisticsResponse,
  BackendStatisticsResponse,
} from '../types';
import { transformStatisticsData } from '../utils/formatters';

export const statisticsApi = {
  /**
   * Lấy thống kê cá nhân với các filter tuỳ chọn
   * @param params - query parameters (startDate, endDate, groupBy)
   * @returns StatisticsResponse
   */
  getMyStatistics: async (
    params?: StatisticsQueryParams,
  ): Promise<StatisticsResponse> => {
    const response = await apiClient.get<BackendStatisticsResponse>(
      '/statistics/my-stats',
      {
        params,
      },
    );

    // Transform backend data to UI format
    // Lấy groupBy từ response hoặc params, default là 'month'
    const groupBy = response.data.groupBy || params?.groupBy || 'month';
    const periods = transformStatisticsData(response.data.data, groupBy);

    // Calculate summary
    const summary = {
      totalRevenue: periods.reduce((sum, p) => sum + p.totalRevenue, 0),
      totalQuantitySold: periods.reduce(
        (sum, p) => sum + p.totalQuantitySold,
        0,
      ),
      totalTransactions: periods.reduce(
        (sum, p) => sum + p.totalTransactions,
        0,
      ),
      averageTransaction:
        periods.length > 0
          ? periods.reduce((sum, p) => sum + p.averageTransaction, 0) /
            periods.length
          : 0,
    };

    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        summary,
        periods,
      },
    };
  },

  /**
   * Lấy thống kê toàn bộ doanh thu (không có filter ngày)
   */
  getOverallStatistics: async (): Promise<StatisticsResponse> => {
    return statisticsApi.getMyStatistics();
  },

  /**
   * Lấy thống kê theo tháng hiện tại
   */
  getCurrentMonthStatistics: async (): Promise<StatisticsResponse> => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return statisticsApi.getMyStatistics({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
  },

  /**
   * Lấy thống kê theo khoảng ngày cụ thể
   */
  getStatisticsByDateRange: async (
    startDate: Date,
    endDate: Date,
    groupBy?: 'day' | 'week' | 'month' | 'year',
  ): Promise<StatisticsResponse> => {
    return statisticsApi.getMyStatistics({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      groupBy,
    });
  },
};

/**
 * Format date to YYYY-MM-DD format
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
