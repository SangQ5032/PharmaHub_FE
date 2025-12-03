import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  TextStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import { formatCurrency, formatNumber } from '@shared/utils/formatters';

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
  format?: 'currency' | 'number' | 'date' | 'text';
}

interface StatTableProps {
  data: any[];
  columns: TableColumn[];
  title?: string;
  emptyMessage?: string;
  containerStyle?: ViewStyle;
  pageSize?: number;
}

/**
 * Component hiển thị bảng thống kê với phân trang
 */
export const StatTable: React.FC<StatTableProps> = ({
  data,
  columns,
  title,
  emptyMessage = 'Không có dữ liệu',
  containerStyle,
  pageSize = 10,
}) => {
  const [page, setPage] = useState(0);

  const formatValue = (value: any, format?: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(Number(value));
      case 'number':
        return formatNumber(Number(value));
      case 'date':
        return new Date(value).toLocaleDateString('vi-VN');
      default:
        return String(value);
    }
  };

  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);
  const maxPage = Math.ceil(data.length / pageSize);

  if (data.length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {columns.map(column => (
              <View
                key={column.key}
                style={[
                  styles.headerCell,
                  {
                    flex: column.width || 1,
                    justifyContent:
                      column.align === 'center'
                        ? 'center'
                        : column.align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.headerText,
                    {
                      textAlign: column.align || 'left',
                    } as TextStyle,
                  ]}
                >
                  {column.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {paginatedData.map((row, index) => (
            <View key={index} style={styles.row}>
              {columns.map(column => {
                const value = row[column.key];
                const displayValue = column.render
                  ? column.render(value, row)
                  : formatValue(value, column.format);

                return (
                  <View
                    key={column.key}
                    style={[
                      styles.cell,
                      {
                        flex: column.width || 1,
                        justifyContent:
                          column.align === 'center'
                            ? 'center'
                            : column.align === 'right'
                            ? 'flex-end'
                            : 'flex-start',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        {
                          textAlign: column.align || 'left',
                        } as TextStyle,
                      ]}
                      numberOfLines={2}
                    >
                      {displayValue}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      {maxPage > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              page === 0 && styles.disabledButton,
            ]}
            onPress={() => page > 0 && setPage(page - 1)}
            disabled={page === 0}
          >
            <Text style={styles.paginationButtonText}>← Trước</Text>
          </TouchableOpacity>
          <Text style={styles.paginationLabel}>
            {page * pageSize + 1}-{Math.min((page + 1) * pageSize, data.length)}{' '}
            / {data.length}
          </Text>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              page === maxPage - 1 && styles.disabledButton,
            ]}
            onPress={() => page < maxPage - 1 && setPage(page + 1)}
            disabled={page === maxPage - 1}
          >
            <Text style={styles.paginationButtonText}>Sau →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    padding: 12,
    backgroundColor: '#ecf0f1',
  } as TextStyle,
  table: {
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderBottomWidth: 2,
    borderBottomColor: '#bdc3c7',
  },
  headerCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 80,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  } as TextStyle,
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 80,
  },
  cellText: {
    fontSize: 12,
    color: '#34495e',
  } as TextStyle,
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
  } as TextStyle,
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#3498db',
    marginHorizontal: 8,
  },
  paginationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.6,
  },
  paginationLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginHorizontal: 8,
  } as TextStyle,
});
