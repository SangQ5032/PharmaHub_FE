/**
 * System Admin Statistics Utilities
 */

import { RevenuePeriodItem } from '../types/system-admin.types';

/**
 * Format currency to VND
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format date string (YYYY-MM-DD to DD/MM/YYYY)
 */
export const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN').format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format period label based on groupBy value
 * @param periodId - The period identifier (e.g., "2024-01-01", "2024-W01", "2024-01", "2024")
 * @param groupBy - The grouping type
 */
export const formatPeriodLabel = (
  periodId: string,
  groupBy: 'day' | 'week' | 'month' | 'year' = 'day',
): string => {
  if (!periodId) return '';

  switch (groupBy) {
    case 'day': {
      return formatDisplayDate(periodId);
    }
    case 'week': {
      // Format: "2024-W01" -> "Tuần 01/2024"
      const match = periodId.match(/(\d{4})-W(\d{2})/);
      if (match) {
        return `Tuần ${match[2]}/${match[1]}`;
      }
      return periodId;
    }
    case 'month': {
      // Format: "2024-01" -> "Tháng 01/2024"
      const match = periodId.match(/(\d{4})-(\d{2})/);
      if (match) {
        return `Tháng ${match[2]}/${match[1]}`;
      }
      return periodId;
    }
    case 'year': {
      // Format: "2024" -> "Năm 2024"
      return `Năm ${periodId}`;
    }
    default:
      return periodId;
  }
};

/**
 * Get date range from today minus X days
 */
export const getDateRangeFromDaysAgo = (
  daysAgo: number,
): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  };
};

/**
 * Format date for API call (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current month date range
 */
export const getCurrentMonthDateRange = (): {
  startDate: string;
  endDate: string;
} => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date();

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  };
};

/**
 * Get current year date range
 */
export const getCurrentYearDateRange = (): {
  startDate: string;
  endDate: string;
} => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date();

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  };
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

/**
 * Format percentage string with +/- sign and color hint
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Get status badge color based on inventory status
 */
export const getStatusColor = (
  status: 'Còn hàng' | 'Hết hàng' | string,
): string => {
  switch (status) {
    case 'Còn hàng':
      return '#4CAF50'; // Green
    case 'Hết hàng':
      return '#f44336'; // Red
    default:
      return '#999'; // Gray
  }
};

/**
 * Get expiry status color
 */
export const getExpiryStatusColor = (
  status: 'Còn hạn' | 'Sắp hết hạn' | 'Hết hạn' | string,
): string => {
  switch (status) {
    case 'Còn hạn':
      return '#4CAF50'; // Green
    case 'Sắp hết hạn':
      return '#FF9800'; // Orange
    case 'Hết hạn':
      return '#f44336'; // Red
    default:
      return '#999'; // Gray
  }
};

/**
 * Parse period data for chart display
 */
export const parseChartData = (
  data: RevenuePeriodItem[],
  groupBy: 'day' | 'week' | 'month' | 'year',
): Array<{
  label: string;
  value: number;
}> => {
  return data.map(item => ({
    label: formatPeriodLabel(item._id, groupBy),
    value: item.totalRevenue,
  }));
};
