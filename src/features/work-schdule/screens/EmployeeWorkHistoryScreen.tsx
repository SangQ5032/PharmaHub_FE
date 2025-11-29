/**
 * Employee Work History List Screen
 * Hiển thị danh sách lịch sử làm việc của nhân viên
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useMyWorkHistory } from '@features/work-schdule/hooks/useWorkScheduleHistory';
import { WorkScheduleHistoryRecord } from '@features/work-schdule/types/workScheduleHistory.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ROUTES } from '@shared/constants/routes';

type NavigationProp = NativeStackNavigationProp<any>;

export const EmployeeWorkHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [page, setPage] = useState(1);
  const [shift, setShift] = useState<'morning' | 'afternoon' | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useMyWorkHistory({
    page,
    limit: 15,
    shift,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = () => {
    if (data?.pagination?.page < data?.pagination?.totalPages) {
      setPage(page + 1);
    }
  };

  const handleShiftFilter = (
    selectedShift: 'morning' | 'afternoon' | undefined,
  ) => {
    setShift(selectedShift);
    setPage(1);
  };

  const handleViewDetail = (record: WorkScheduleHistoryRecord) => {
    // Truyền recordId để detail screen gọi API lấy dữ liệu chi tiết + hoá đơn
    navigation.navigate(ROUTES.EMPLOYEE_WORK_HISTORY_DETAIL, {
      recordId: record._id,
    });
  };

  // Unused: formatDateTime - can be removed or used in future
  // const formatDateTime = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('vi-VN', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return 'check-circle';
      case 'checked_in':
        return 'clock-outline';
      case 'late':
        return 'alert-circle';
      case 'early':
        return 'check-clock';
      case 'absent':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return '#4CAF50';
      case 'checked_in':
        return '#2196F3';
      case 'late':
        return '#FF9800';
      case 'early':
        return '#9C27B0';
      case 'absent':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'checked_out':
        return 'Đã checkout';
      case 'checked_in':
        return 'Đang làm';
      case 'late':
        return 'Đi trễ';
      case 'early':
        return 'Về sớm';
      case 'absent':
        return 'Vắng mặt';
      default:
        return 'Không xác định';
    }
  };

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        Lịch Sử Làm Việc
      </Text>

      {/* Shift Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => handleShiftFilter(undefined)}
          style={[
            styles.filterButton,
            {
              backgroundColor: !shift ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: !shift ? '#fff' : colors.text },
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShiftFilter('morning')}
          style={[
            styles.filterButton,
            {
              backgroundColor: shift === 'morning' ? '#FF9500' : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: shift === 'morning' ? '#fff' : colors.text },
            ]}
          >
            Sáng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShiftFilter('afternoon')}
          style={[
            styles.filterButton,
            {
              backgroundColor: shift === 'afternoon' ? '#5856D6' : colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: shift === 'afternoon' ? '#fff' : colors.text },
            ]}
          >
            Chiều
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {data && (
        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, { color: colors.text }]}>
            {data.pagination?.total || 0} bản ghi • Trang{' '}
            {data.pagination?.page || 1}/{data.pagination?.totalPages || 1}
          </Text>
        </View>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: WorkScheduleHistoryRecord }) => (
    <TouchableOpacity
      onPress={() => handleViewDetail(item)}
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardContent}>
        {/* Date & Status */}
        <View style={styles.cardTop}>
          <View>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(item.date)}
            </Text>
            <Text style={[styles.timeText, { color: colors.gray }]}>
              {formatTime(item.checkin_time)}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <MaterialCommunityIcons
              name={getStatusIcon(item.status)}
              size={16}
              color="#fff"
            />
            <Text style={styles.statusBadgeText}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        {/* Shift & Working Hours */}
        <View style={styles.cardRow}>
          <MaterialCommunityIcons
            name={item.shift === 'morning' ? 'weather-sunny' : 'weather-night'}
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.cardLabel, { color: colors.text }]}>
            {item.shift === 'morning' ? 'Ca sáng' : 'Ca chiều'} •{' '}
            {item.working_hours.toFixed(1)} giờ
          </Text>
        </View>

        {/* Branch */}
        <View style={styles.cardRow}>
          <MaterialCommunityIcons
            name="office-building"
            size={16}
            color={colors.primary}
          />
          <Text
            style={[styles.cardLabel, { color: colors.text }]}
            numberOfLines={1}
          >
            {item.branch_id.name}
          </Text>
        </View>

        {/* Check-in/Check-out times */}
        <View style={styles.cardRow}>
          <MaterialCommunityIcons
            name="clock-check"
            size={16}
            color={colors.primary}
          />
          <Text
            style={[styles.cardValue, { color: colors.text }]}
            numberOfLines={1}
          >
            {formatTime(item.checkin_time)} -{' '}
            {item.checkout_time
              ? formatTime(item.checkout_time)
              : 'Chưa checkout'}
          </Text>
        </View>

        {/* On Schedule Status */}
        <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
          <View style={styles.scheduleStatus}>
            <MaterialCommunityIcons
              name={item.isOnSchedule ? 'check-circle' : 'alert-circle'}
              size={16}
              color={item.isOnSchedule ? '#4CAF50' : '#FF9800'}
            />
            <Text
              style={[
                styles.scheduleStatusText,
                { color: item.isOnSchedule ? '#4CAF50' : '#FF9800' },
              ]}
            >
              {item.isOnSchedule ? 'Đúng lịch' : 'Ngoài lịch'}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="calendar-blank"
        size={64}
        color={colors.primary}
      />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        Không có lịch sử làm việc
      </Text>
      <Text style={[styles.emptySubText, { color: colors.gray }]}>
        Lịch sử làm việc của bạn sẽ hiển thị ở đây
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || page === 1) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.footerLoaderText, { color: colors.text }]}>
          Đang tải...
        </Text>
      </View>
    );
  };

  if (isError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={colors.notification}
          />
          <Text style={[styles.errorText, { color: colors.notification }]}>
            Lỗi khi tải dữ liệu
          </Text>
          <TouchableOpacity
            onPress={() => {
              setPage(1);
              refetch();
            }}
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={
          !data?.data?.length ? { flex: 1 } : { paddingBottom: 20 }
        }
      />
      {isLoading && page === 1 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    paddingTop: 8,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  cardValue: {
    fontSize: 13,
    flex: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    marginTop: 6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
