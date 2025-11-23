// src/features/warehouse/components/CrossBranchInventoryCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CrossBranchInventoryItem } from '@features/warehouse/types/cross-branch.types';
import { BranchStockBadge } from './BranchStockBadge';

interface CrossBranchInventoryCardProps {
  item: CrossBranchInventoryItem;
  onPress?: () => void;
}

/**
 * Card hiển thị tồn kho cross-branch của 1 thuốc
 * Hiển thị tồn kho từ tất cả các chi nhánh
 */
export const CrossBranchInventoryCard: React.FC<
  CrossBranchInventoryCardProps
> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header - Medicine info */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.medicineName} numberOfLines={1}>
            📦 {item.medicine_name}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.unitLabel}>Đơn vị:</Text>
          <Text style={styles.unit}>{item.unit}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Body - Branch stocks */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Tồn kho theo chi nhánh:</Text>
        {item.branches.map((branch, index) => (
          <BranchStockBadge
            key={`${branch.branch_id}-${index}`}
            branchName={branch.branch_name}
            quantity={branch.quantity}
            status={branch.status}
            unit={item.unit}
            size="medium"
          />
        ))}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer - Summary */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tổng tồn:</Text>
            <Text style={styles.summaryValue}>
              {item.total_quantity} {item.unit}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Chênh lệch:</Text>
            <Text style={[styles.summaryValue, styles.differenceValue]}>
              {item.difference} {item.unit}
            </Text>
          </View>
        </View>
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap để so sánh chi tiết →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#666',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  unitLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2196F3',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  body: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  differenceValue: {
    color: '#FF9800',
  },
  tapHint: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tapHintText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
});
