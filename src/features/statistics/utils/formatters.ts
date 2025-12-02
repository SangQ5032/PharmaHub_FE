import { GroupBy } from '../types';
import { BackendStatisticsPeriod, StatisticsPeriod } from '../types';

/**
 * Format currency to Vietnamese Dong
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Transform backend statistics data to UI format
 */
export const transformStatisticsData = (
  data: BackendStatisticsPeriod[],
  groupBy: GroupBy,
): StatisticsPeriod[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(item => {
    const formattedDate = formatDateFromId(item._id, groupBy);

    return {
      date: formattedDate,
      totalRevenue: item.totalRevenue || 0,
      totalQuantitySold: item.totalQuantity || 0,
      totalTransactions: item.totalOrders || 0,
      averageTransaction: item.averageOrderValue || 0,
    };
  });
};

/**
 * Format date based on groupBy type
 */
export const formatPeriodLabel = (
  date: string | undefined,
  groupBy: GroupBy,
): string => {
  if (!date) {
    return 'N/A';
  }

  try {
    let result = '';
    switch (groupBy) {
      case 'day':
        result = formatDayLabel(date);
        break;
      case 'week':
        result = formatWeekLabel(date);
        break;
      case 'month':
        result = formatMonthLabel(date);
        break;
      case 'year':
        result = date; // YYYY
        break;
      default:
        result = date;
    }
    return result;
  } catch (error) {
    return date || 'N/A';
  }
};

/**
 * Format date from backend _id object
 */
export const formatDateFromId = (
  id: { year: number; month?: number; week?: number; day?: number },
  groupBy: GroupBy,
): string => {
  if (!id) {
    return 'N/A';
  }

  try {
    switch (groupBy) {
      case 'day':
        // Backend có thể chỉ gửi year và month, không gửi day
        if (id.day !== undefined && id.month !== undefined) {
          const month = String(id.month).padStart(2, '0');
          const day = String(id.day).padStart(2, '0');
          return `${id.year}-${month}-${day}`;
        }
        return `${id.year}`;

      case 'week':
        if (id.week !== undefined) {
          const week = String(id.week).padStart(2, '0');
          return `${id.year}-W${week}`;
        }
        return `${id.year}`;

      case 'month':
        // Backend có gửi month
        if (id.month !== undefined) {
          const month = String(id.month).padStart(2, '0');
          return `${id.year}-${month}`;
        }
        return `${id.year}`;

      case 'year':
      default: {
        return `${id.year}`;
      }
    }
  } catch (error) {
    return 'N/A';
  }
};

const formatDayLabel = (dateStr: string): string => {
  // Format: YYYY-MM-DD -> DD/MM/YYYY
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

const formatWeekLabel = (weekStr: string): string => {
  // Format: YYYY-W## -> Tuần ## / YYYY
  if (!weekStr) return 'N/A';
  const match = weekStr.match(/(\d{4})-W(\d{2})/);
  if (match) {
    return `Tuần ${parseInt(match[2], 10)} / ${match[1]}`;
  }
  return weekStr;
};

const formatMonthLabel = (monthStr: string): string => {
  // Format: YYYY-MM -> Tháng MM / YYYY
  if (!monthStr) return 'N/A';

  const [year, month] = monthStr.split('-');
  if (!month) {
    return `${year}`;
  }

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const monthIndex = parseInt(month, 10) - 1;
  const monthName = monthNames[monthIndex] || `Tháng ${month}`;
  return `${monthName} / ${year}`;
};

/**
 * Get month name in Vietnamese
 */
export const getMonthName = (monthNumber: number): string => {
  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  return monthNames[monthNumber - 1] || '';
};

/**
 * Get week number from date
 */
export const getWeekNumber = (date: Date): number => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
