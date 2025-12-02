export type GroupBy = 'day' | 'week' | 'month' | 'year';

export interface StatisticsQueryParams {
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  groupBy?: GroupBy;
}

export interface StatisticsPeriod {
  date: string; // Tuỳ theo groupBy: YYYY-MM-DD, YYYY-W##, YYYY-MM, YYYY
  totalRevenue: number;
  totalQuantitySold: number;
  totalTransactions: number;
  averageTransaction: number;
}

// API Response từ backend (format thực tế)
export interface BackendStatisticsPeriod {
  _id: {
    year: number;
    month?: number;
    week?: number;
    day?: number;
  };
  totalOrders: number;
  totalQuantity: number;
  totalRevenue: number;
  totalDiscount: number;
  totalTax: number;
  averageOrderValue: number;
}

export interface BackendStatisticsResponse {
  success: boolean;
  message?: string;
  groupBy?: GroupBy;
  data: BackendStatisticsPeriod[];
}

export interface StatisticsResponse {
  success: boolean;
  data: {
    summary: {
      totalRevenue: number;
      totalQuantitySold: number;
      totalTransactions: number;
      averageTransaction: number;
    };
    periods: StatisticsPeriod[];
  };
  message?: string;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  groupBy: GroupBy;
}
