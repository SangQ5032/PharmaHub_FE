import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

type ValueFormat = 'currency' | 'number' | 'text' | 'date';

export interface InsightKV {
  label: string;
  value: string | number | null | undefined;
  format?: ValueFormat;
  color?: string;
}

export interface InsightBadge {
  text: string;
  color?: string;
  backgroundColor?: string;
}

export interface InsightItem {
  id: string;
  title: string;
  subtitle?: string;
  rank?: number;
  rightText?: string; // e.g. "12.3M"
  rightTextFormat?: ValueFormat;
  badges?: InsightBadge[];
  rows?: InsightKV[];
}

interface StatInsightListProps {
  title?: string;
  items: InsightItem[];
  initialVisible?: number;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
}

const formatValue = (value: any, format?: ValueFormat) => {
  switch (format) {
    case 'currency':
      return formatCurrency(Number(value || 0));
    case 'number':
      return formatNumber(Number(value || 0));
    case 'date': {
      if (!value) return 'N/A';
      const d = new Date(value);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString('vi-VN');
    }
    default:
      return value !== null && value !== undefined ? String(value) : '';
  }
};

export const StatInsightList: React.FC<StatInsightListProps> = ({
  title,
  items,
  initialVisible = 6,
  emptyMessage = 'Không có dữ liệu',
  containerStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    if (expanded) return items;
    return items.slice(0, initialVisible);
  }, [expanded, items, initialVisible]);

  if (!items || items.length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

      <View style={styles.list}>
        {visibleItems.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.titleRow}>
                  {typeof item.rank === 'number' ? (
                    <View style={styles.rankPill}>
                      <Text style={styles.rankText}>#{item.rank}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
                {item.subtitle ? (
                  <Text style={styles.cardSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>

              {item.rightText ? (
                <Text style={styles.rightText}>
                  {formatValue(item.rightText, item.rightTextFormat)}
                </Text>
              ) : null}
            </View>

            {item.badges && item.badges.length > 0 ? (
              <View style={styles.badgeRow}>
                {item.badges.map((b, idx) => (
                  <View
                    key={`${item.id}-badge-${idx}`}
                    style={[
                      styles.badge,
                      b.backgroundColor
                        ? { backgroundColor: b.backgroundColor }
                        : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        b.color ? { color: b.color } : null,
                      ]}
                    >
                      {b.text}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {item.rows && item.rows.length > 0 ? (
              <View style={styles.rows}>
                {item.rows.map((row, idx) => (
                  <View key={`${item.id}-row-${idx}`} style={styles.row}>
                    <Text style={styles.rowLabel} numberOfLines={1}>
                      {row.label}
                    </Text>
                    <Text
                      style={[
                        styles.rowValue,
                        row.color ? { color: row.color } : null,
                      ]}
                      numberOfLines={1}
                    >
                      {formatValue(row.value, row.format)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {items.length > initialVisible ? (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setExpanded(v => !v)}
        >
          <Text style={styles.toggleButtonText}>
            {expanded
              ? 'Thu gọn'
              : `Xem thêm (${items.length - initialVisible})`}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  } as TextStyle,
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankPill: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34495e',
  } as TextStyle,
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2d3d',
  } as TextStyle,
  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#7f8c8d',
  } as TextStyle,
  rightText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1976d2',
  } as TextStyle,
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f5f7fa',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34495e',
  } as TextStyle,
  rows: {
    marginTop: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    flex: 1,
  } as TextStyle,
  rowValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2c3e50',
  } as TextStyle,
  toggleButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f5f7fa',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34495e',
  } as TextStyle,
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#eef2f7',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#95a5a6',
    fontStyle: 'italic',
  } as TextStyle,
});
