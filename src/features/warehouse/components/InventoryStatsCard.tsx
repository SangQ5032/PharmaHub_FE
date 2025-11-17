// src/features/warehouse/components/InventoryStatsCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InventoryStats } from '@features/warehouse/types/inventory.types';

interface InventoryStatsCardProps {
  stats: InventoryStats;
}

export const InventoryStatsCard: React.FC<InventoryStatsCardProps> = ({
  stats,
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tổng quan tồn kho</Text>

      <View style={styles.statsGrid}>
        {/* Total items */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total_items}</Text>
          <Text style={styles.statLabel}>Tổng số lượng</Text>
        </View>

        {/* Total medicines */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total_medicines}</Text>
          <Text style={styles.statLabel}>Loại thuốc</Text>
        </View>

        {/* Low stock */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.warningValue]}>
            {stats.low_stock_count}
          </Text>
          <Text style={styles.statLabel}>Sắp hết</Text>
        </View>

        {/* Out of stock */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.errorValue]}>
            {stats.out_of_stock_count}
          </Text>
          <Text style={styles.statLabel}>Hết hàng</Text>
        </View>
      </View>

      {/* Total value */}
      <View style={styles.totalValue}>
        <Text style={styles.totalLabel}>Tổng giá trị:</Text>
        <Text style={styles.totalAmount}>
          {formatCurrency(stats.total_value)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  warningValue: {
    color: '#FF9800',
  },
  errorValue: {
    color: '#F44336',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  totalValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
});
