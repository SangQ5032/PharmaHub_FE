// src/features/warehouse/components/ReportSummaryCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryItem {
  label: string;
  value: string | number;
  color?: string;
  icon?: string;
}

interface ReportSummaryCardProps {
  title: string;
  items: SummaryItem[];
}

export const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({
  title,
  items,
}) => {
  return (
    <View style={styles.card}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Summary Items */}
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              {item.icon && <Text style={styles.icon}>{item.icon}</Text>}
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={[styles.value, item.color && { color: item.color }]}>
              {item.value}
            </Text>
          </View>
        ))}
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
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: '#757575',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
});
