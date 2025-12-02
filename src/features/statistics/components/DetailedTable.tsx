import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StatisticsPeriod, GroupBy } from '../types';
import { formatPeriodLabel, formatCurrency } from '../utils/formatters';

interface DetailedTableProps {
  data: StatisticsPeriod[];
  groupBy: GroupBy;
}

export const DetailedTable: React.FC<DetailedTableProps> = ({
  data,
  groupBy,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có dữ liệu để hiển thị</Text>
      </View>
    );
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: StatisticsPeriod;
    index: number;
  }) => {
    const isEven = index % 2 === 0;
    const dateLabel = formatPeriodLabel(item.date, groupBy);
    const revenueLabel = formatCurrency(item.totalRevenue);

    return (
      <View style={[styles.row, isEven && styles.rowEven]}>
        <Text style={[styles.cell, styles.dateCell]} numberOfLines={1}>
          {dateLabel || 'N/A'}
        </Text>
        <Text style={[styles.cell, styles.numberCell]} numberOfLines={1}>
          {revenueLabel || '0 ₫'}
        </Text>
        <Text style={[styles.cell, styles.numberCell]} numberOfLines={1}>
          {item.totalQuantitySold?.toLocaleString('vi-VN') || '0'}
        </Text>
        <Text style={[styles.cell, styles.numberCell]} numberOfLines={1}>
          {item.totalTransactions || '0'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerCell, styles.dateCell]}>Thời Gian</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>Doanh Thu</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>SL Bán</Text>
        <Text style={[styles.headerCell, styles.numberCell]}>Giao Dịch</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 11,
  },
  dateCell: {
    flex: 2,
    paddingLeft: 8,
  },
  numberCell: {
    flex: 1.5,
    textAlign: 'right',
    paddingRight: 8,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowEven: {
    backgroundColor: '#F9F9F9',
  },
  cell: {
    fontSize: 11,
    color: '#333',
  },
  emptyContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
