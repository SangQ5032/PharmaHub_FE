import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkScheduleHistoryRecord } from '@features/work-schdule/types/workScheduleHistory.types';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '@shared/constants/routes';

type NavigationProp = NativeStackNavigationProp<any>;

interface WorkHistoryListProps {
  data: WorkScheduleHistoryRecord[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export const WorkHistoryList: React.FC<WorkHistoryListProps> = ({
  data,
  isLoading,
  isError,
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getShiftLabel = (shift: string): string => {
    return shift === 'morning' ? 'Ca sáng' : 'Ca chiều';
  };

  const getShiftColor = (shift: string): string => {
    return shift === 'morning' ? '#FF9500' : '#5856D6';
  };

  const handleRowPress = (record: WorkScheduleHistoryRecord) => {
    navigation.navigate(ROUTES.EMPLOYEE_WORK_HISTORY_DETAIL, {
      recordId: record._id,
    });
  };

  const renderItem = ({ item }: { item: WorkScheduleHistoryRecord }) => (
    <TouchableOpacity onPress={() => handleRowPress(item)} activeOpacity={0.7}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text
              style={[styles.employeeName, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.user_id?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.shiftBadge,
                { backgroundColor: getShiftColor(item.shift) },
              ]}
            >
              <Text style={styles.shiftBadgeText}>
                {getShiftLabel(item.shift)}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.primary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Ngày:</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(item.date)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>
              Chi nhánh:
            </Text>
            <Text
              style={[styles.value, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.branch_id?.name || 'N/A'}
            </Text>
          </View>

          {item.note && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                Ghi chú:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {item.note}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>
              Ngày tạo:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        Không có dữ liệu lịch sử làm việc
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.notification }]}>
          Lỗi khi tải dữ liệu. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={hasNextPage ? onEndReached : undefined}
      onEndReachedThreshold={0.5}
      scrollEnabled={true}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  shiftBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  shiftBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    flex: 0.35,
  },
  value: {
    fontSize: 13,
    flex: 0.65,
    textAlign: 'right',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
