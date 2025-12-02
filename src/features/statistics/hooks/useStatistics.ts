import { useQuery } from '@tanstack/react-query';
import { statisticsApi, formatDate } from '../api/statisticsApi';
import { StatisticsQueryParams, StatisticsResponse, GroupBy } from '../types';

interface UseStatisticsOptions {
  startDate?: Date;
  endDate?: Date;
  groupBy?: GroupBy;
  enabled?: boolean;
}

export const useStatistics = (options?: UseStatisticsOptions) => {
  const {
    startDate,
    endDate,
    groupBy = 'month',
    enabled = true,
  } = options || {};

  const params: StatisticsQueryParams = {};

  if (startDate) params.startDate = formatDate(startDate);
  if (endDate) params.endDate = formatDate(endDate);
  if (groupBy) params.groupBy = groupBy;

  return useQuery<StatisticsResponse, Error>({
    queryKey: ['statistics', params],
    queryFn: () => statisticsApi.getMyStatistics(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook để lấy tổng thống kê (toàn bộ doanh thu)
 */
export const useOverallStatistics = (enabled = true) => {
  return useQuery<StatisticsResponse, Error>({
    queryKey: ['statistics-overall'],
    queryFn: () => statisticsApi.getOverallStatistics(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook để lấy thống kê tháng hiện tại
 */
export const useCurrentMonthStatistics = (enabled = true) => {
  return useQuery<StatisticsResponse, Error>({
    queryKey: ['statistics-current-month'],
    queryFn: () => statisticsApi.getCurrentMonthStatistics(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
