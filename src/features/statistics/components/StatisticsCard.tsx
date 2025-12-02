import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/formatters';

interface StatisticsCardProps {
  title: string;
  value: number;
  icon: string;
  type?: 'currency' | 'number' | 'transaction';
  color?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  type = 'currency',
  color = '#007AFF',
}) => {
  const safeValue = value || 0;
  const displayValue =
    type === 'currency'
      ? formatCurrency(safeValue)
      : safeValue.toLocaleString('vi-VN');

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title || 'N/A'}</Text>
        <Text style={[styles.icon, { color }]}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{displayValue || '0'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderLeftWidth: 4,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});
