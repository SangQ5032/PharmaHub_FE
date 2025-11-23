// src/features/warehouse/components/BranchStockBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StockStatus = 'normal' | 'low' | 'out_of_stock';

interface BranchStockBadgeProps {
  branchName: string;
  quantity: number;
  status: StockStatus;
  unit?: string;
  size?: 'small' | 'medium';
}

/**
 * Component hiển thị badge tồn kho của 1 chi nhánh
 * Sử dụng trong CrossBranchInventoryCard
 */
export const BranchStockBadge: React.FC<BranchStockBadgeProps> = ({
  branchName,
  quantity,
  status,
  unit = '',
  size = 'medium',
}) => {
  // Status color configurations
  const statusColors = {
    normal: '#4CAF50', // Xanh lá
    low: '#FF9800', // Cam
    out_of_stock: '#F44336', // Đỏ
  };

  // Status labels
  const statusLabels = {
    normal: 'Bình thường',
    low: 'Sắp hết',
    out_of_stock: 'Hết hàng',
  };

  const backgroundColor = statusColors[status];
  const statusLabel = statusLabels[status];

  return (
    <View style={styles.container}>
      {/* Branch name */}
      <View style={styles.branchNameContainer}>
        <Text style={styles.branchIcon}>🏢</Text>
        <Text
          style={[
            styles.branchName,
            size === 'small' && styles.branchNameSmall,
          ]}
          numberOfLines={1}
        >
          {branchName}
        </Text>
      </View>

      {/* Quantity */}
      <View style={styles.quantityContainer}>
        <Text
          style={[styles.quantity, size === 'small' && styles.quantitySmall]}
        >
          {quantity} {unit}
        </Text>
      </View>

      {/* Status badge */}
      <View
        style={[
          styles.statusBadge,
          { backgroundColor },
          size === 'small' && styles.statusBadgeSmall,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            size === 'small' && styles.statusTextSmall,
          ]}
        >
          {statusLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 6,
  },
  branchNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  branchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  branchName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  branchNameSmall: {
    fontSize: 12,
  },
  quantityContainer: {
    marginRight: 8,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  quantitySmall: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  statusTextSmall: {
    fontSize: 10,
  },
});
