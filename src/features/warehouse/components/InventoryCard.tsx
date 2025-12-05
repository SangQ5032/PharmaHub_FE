// src/features/warehouse/components/InventoryCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InventoryItem } from '@features/warehouse/types/inventory.types';

interface InventoryCardProps {
  item: InventoryItem;
  onPress?: () => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onPress,
}) => {
  // Determine status based on quantity and warning threshold
  const getStatus = (): 'normal' | 'low' | 'out_of_stock' => {
    if (item.quantity === 0) return 'out_of_stock';
    if (
      item.medicine?.warning_threshold &&
      item.quantity <= item.medicine.warning_threshold
    ) {
      return 'low';
    }
    return 'normal';
  };

  const status = item.status || getStatus();

  // Status colors
  const statusColors = {
    normal: '#4CAF50',
    low: '#FF9800',
    out_of_stock: '#F44336',
  };

  // Status labels
  const statusLabels = {
    normal: 'Bình thường',
    low: 'Sắp hết',
    out_of_stock: 'Hết hàng',
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.medicineName} numberOfLines={1}>
            {item.medicine?.name || 'N/A'}
          </Text>
          <Text style={styles.category}>{item.medicine?.category || ''}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[status] },
          ]}
        >
          <Text style={styles.statusText}>{statusLabels[status]}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>Số lượng:</Text>
          <Text
            style={[
              styles.value,
              styles.quantityValue,
              { color: statusColors[status] },
            ]}
          >
            {(item as any).total_quantity_in_base_unit || item.quantity}{' '}
            {(item as any).medicine?.base_unit || item.medicine?.unit || ''}
          </Text>
        </View>

        {/* Multi-Unit Display */}
        {(item as any).quantities_by_unit && (
          <View style={styles.multiUnitRow}>
            <Text style={styles.label}>Tồn kho:</Text>
            <View style={styles.unitChips}>
              {(item as any).quantities_by_unit.box !== undefined && (
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipText}>
                    {(item as any).quantities_by_unit.box} hộp
                  </Text>
                </View>
              )}
              {(item as any).quantities_by_unit.blister !== undefined && (
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipText}>
                    {(item as any).quantities_by_unit.blister} vỉ
                  </Text>
                </View>
              )}
              {(item as any).quantities_by_unit.tablet !== undefined && (
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipText}>
                    {(item as any).quantities_by_unit.tablet} viên
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {item.medicine?.warning_threshold && (
          <View style={styles.row}>
            <Text style={styles.label}>Ngưỡng cảnh báo:</Text>
            <Text style={styles.value}>
              {item.medicine.warning_threshold} {item.medicine.unit}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Cập nhật:</Text>
          <Text style={styles.value}>{formatDate(item.last_updated)}</Text>
        </View>
      </View>

      {/* Footer */}
      {item.medicine?.expiry_date && (
        <View style={styles.footer}>
          <Text style={styles.expiryLabel}>HSD:</Text>
          <Text style={styles.expiryValue}>
            {formatDate(item.medicine.expiry_date)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
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
    color: '#212121',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#757575',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expiryLabel: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  expiryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF9800',
  },
  multiUnitRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  unitChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  unitChip: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976D2',
  },
});
