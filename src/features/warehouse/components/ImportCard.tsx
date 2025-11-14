// src/features/warehouse/components/ImportCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ImportRecord } from '@features/warehouse/types/import.types';

interface ImportCardProps {
  import: ImportRecord;
  onPress?: () => void;
}

export const ImportCard: React.FC<ImportCardProps> = ({
  import: importRecord,
  onPress,
}) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.id} numberOfLines={1}>
          #{importRecord._id.slice(-8).toUpperCase()}
        </Text>
        <Text style={styles.date}>{formatDate(importRecord.created_at)}</Text>
      </View>

      {/* Supplier */}
      <View style={styles.row}>
        <Text style={styles.label}>Nhà cung cấp:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {importRecord.supplier?.name || 'N/A'}
        </Text>
      </View>

      {/* Branch */}
      <View style={styles.row}>
        <Text style={styles.label}>Chi nhánh:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {importRecord.branch?.name || 'N/A'}
        </Text>
      </View>

      {/* Items count */}
      <View style={styles.row}>
        <Text style={styles.label}>Số loại thuốc:</Text>
        <Text style={styles.value}>{importRecord.items.length}</Text>
      </View>

      {/* Total cost */}
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Tổng chi phí:</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(importRecord.total_cost)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  id: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#757575',
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
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
});
