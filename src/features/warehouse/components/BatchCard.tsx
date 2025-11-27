// src/features/warehouse/components/BatchCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Batch } from '@features/warehouse/types/batch.types';

interface BatchCardProps {
  batch: Batch;
  onPress: () => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'expired':
        return '#F44336';
      case 'discontinued':
        return '#9E9E9E';
      case 'sold_out':
        return '#FF9800';
      default:
        return '#4CAF50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'expired':
        return 'Hết hạn';
      case 'discontinued':
        return 'Ngừng bán';
      case 'sold_out':
        return 'Hết hàng';
      default:
        return 'Không rõ';
    }
  };

  const isExpired = new Date(batch.expiry_date) < new Date();
  const daysToExpiry = Math.ceil(
    (new Date(batch.expiry_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const statusColor = getStatusColor(batch.status);
  const statusLabel = getStatusLabel(batch.status);

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: statusColor }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.batchInfo}>
          <Text style={styles.batchNumber}>{batch.batch_number}</Text>
          <Text style={styles.medicineName} numberOfLines={1}>
            {batch.medicine?.name || 'Không rõ'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusLabel}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Số lượng:</Text>
            <Text style={styles.value}>{batch.quantity}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Giá nhập:</Text>
            <Text style={styles.value}>
              ₫{batch.import_price?.toLocaleString('vi-VN')}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Hạn sử dụng:</Text>
            <Text style={[styles.value, isExpired && styles.expiredText]}>
              {new Date(batch.expiry_date).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Còn lại:</Text>
            <Text
              style={[
                styles.value,
                daysToExpiry < 30 && !isExpired && styles.warningText,
                isExpired && styles.expiredText,
              ]}
            >
              {isExpired ? 'Hết hạn' : `${daysToExpiry} ngày`}
            </Text>
          </View>
        </View>

        {batch.supplier?.name && (
          <View style={styles.footerRow}>
            <MaterialCommunityIcons
              name="truck-delivery-outline"
              size={14}
              color="#9E9E9E"
            />
            <Text style={styles.supplier}>{batch.supplier.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  batchInfo: {
    flex: 1,
    marginRight: 8,
  },
  batchNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  medicineName: {
    fontSize: 12,
    color: '#757575',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  cell: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  supplier: {
    fontSize: 11,
    color: '#9E9E9E',
    marginLeft: 6,
  },
  expiredText: {
    color: '#F44336',
  },
  warningText: {
    color: '#FF9800',
  },
});
