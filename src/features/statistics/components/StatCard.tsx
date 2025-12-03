import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, Text } from 'react-native';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  containerStyle?: ViewStyle;
  valueFormat?: 'currency' | 'number' | 'text';
}

/**
 * Component hiển thị một thống kê đơn (card)
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = '#3498db',
  containerStyle,
  valueFormat = 'number',
}) => {
  const formattedValue =
    valueFormat === 'currency'
      ? formatCurrency(Number(value))
      : valueFormat === 'number'
      ? formatNumber(Number(value))
      : String(value);

  return (
    <View style={[styles.card, containerStyle]}>
      <View style={[styles.cardContent, { borderLeftColor: color }]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{formattedValue}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: number;
}

/**
 * Component hiển thị lưới các StatCard
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 2 }) => {
  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[
            styles.gridItem,
            {
              width: `${100 / columns}%`,
            },
          ]}
        >
          <StatCard {...stat} containerStyle={styles.gridCard} />
        </View>
      ))}
    </View>
  );
};

interface StatsSectionProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Component bao gói một section thống kê
 */
export const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  children,
  containerStyle,
}) => {
  return (
    <View style={[styles.section, containerStyle]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  cardContent: {
    padding: 16,
    borderLeftWidth: 4,
  } as ViewStyle & { borderLeftWidth: number },
  title: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '500',
  } as TextStyle,
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  } as TextStyle,
  subtitle: {
    fontSize: 11,
    color: '#95a5a6',
  } as TextStyle,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  gridCard: {
    marginBottom: 0,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  } as TextStyle,
  sectionContent: {
    marginTop: 8,
  },
});
