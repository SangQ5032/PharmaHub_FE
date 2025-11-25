// src/features/warehouse/components/ImportHistoryCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImportRecord } from '@features/warehouse/types/import.types';

interface ImportHistoryCardProps {
  import: ImportRecord;
  onPress: () => void;
}

export const ImportHistoryCard: React.FC<ImportHistoryCardProps> = ({
  import: importData,
  onPress,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'completed':
        return 'Hoàn tất';
      case 'cancelled':
        return 'Hủy';
      default:
        return 'Không rõ';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle-outline';
    }
  };

  const statusColor = getStatusColor(importData.status);
  const statusLabel = getStatusLabel(importData.status);
  const statusIcon = getStatusIcon(importData.status);

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: statusColor }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.importInfo}>
          <Text style={styles.importNumber}>{importData._id}</Text>
          <Text style={styles.supplierName} numberOfLines={1}>
            {importData.supplier_id?.name || 'Không rõ'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <MaterialCommunityIcons name={statusIcon} size={14} color="white" />
          <Text style={styles.statusLabel}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Ngày nhập:</Text>
            <Text style={styles.value}>
              {new Date(importData.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Số lượng:</Text>
            <Text style={styles.value}>
              {importData.items?.length || 0} loại thuốc
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>Tổng tiền:</Text>
            <Text style={styles.totalAmount}>
              ₫{importData.total_cost?.toLocaleString('vi-VN') || '0'}
            </Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Người tạo:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {importData.employee_id?.username || 'Không rõ'}
            </Text>
          </View>
        </View>

        {importData.note && (
          <View style={styles.notesRow}>
            <MaterialCommunityIcons
              name="note-text-outline"
              size={14}
              color="#9E9E9E"
            />
            <Text style={styles.notes} numberOfLines={2}>
              {importData.note}
            </Text>
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
  importInfo: {
    flex: 1,
    marginRight: 8,
  },
  importNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  supplierName: {
    fontSize: 12,
    color: '#757575',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
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
  totalAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 6,
  },
  notes: {
    fontSize: 11,
    color: '#9E9E9E',
    flex: 1,
  },
});
