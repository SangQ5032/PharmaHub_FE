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
  TextInput,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
  const [searchText, setSearchText] = useState('');
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const formatDateToString = (date?: Date): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data, isLoading, isError, refetch } = useMyWorkHistory({
    page,
    limit: 15,
    shift,
    search: searchText || undefined,
    fromDate: formatDateToString(fromDate),
    toDate: formatDateToString(toDate),
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

  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFromDate(undefined);
    setToDate(undefined);
    setShift(undefined);
    setPage(1);
  };

  const onFromDateChange = (event: any, selectedDate?: Date) => {
    setShowFromDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFromDate(selectedDate);
      setPage(1);
    }
  };

  const onToDateChange = (event: any, selectedDate?: Date) => {
    setShowToDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setToDate(selectedDate);
      setPage(1);
    }
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
    if (!dateString) return '';

    const cleanDateString = dateString.replace(' GM', ' GMT');

    // 2. Tạo đối tượng Date
    const date = new Date(cleanDateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    // 4. Format sang tiếng Việt
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long', // Thứ Tư
      year: 'numeric', // 2025
      month: 'long', // tháng 10
      day: 'numeric', // 8
      // Nếu muốn hiện thêm giờ:
      // hour: '2-digit',
      // minute: '2-digit'
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.text}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.background, color: colors.text },
          ]}
          placeholder="Tìm theo ngày (YYYY-MM-DD)"
          placeholderTextColor={colors.text}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Date Range Filter */}
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          onPress={() => setShowFromDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar-start"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.dateButtonText, { color: colors.text }]}>
            {fromDate ? formatDateToString(fromDate) : 'Từ ngày'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.dateSeparator, { color: colors.text }]}>→</Text>

        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          onPress={() => setShowToDatePicker(true)}
        >
          <MaterialCommunityIcons
            name="calendar-end"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.dateButtonText, { color: colors.text }]}>
            {toDate ? formatDateToString(toDate) : 'Đến ngày'}
          </Text>
        </TouchableOpacity>

        {(fromDate || toDate || searchText) && (
          <TouchableOpacity
            style={[
              styles.clearButton,
              { backgroundColor: colors.notification },
            ]}
            onPress={handleClearFilters}
          >
            <MaterialCommunityIcons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

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
            <Text style={[styles.timeText, { color: colors.text }]}>
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
      <Text style={[styles.emptySubText, { color: colors.text }]}>
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

      {/* Date Pickers */}
      {showFromDatePicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onFromDateChange}
        />
      )}
      {showToDatePicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onToDateChange}
        />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  dateSeparator: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 2,
  },
  clearButton: {
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsContainer: {
    paddingTop: 10,
    paddingBottom: 4,
  },
  statsText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  card: {
    marginHorizontal: 14,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  timeText: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.1,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleStatusText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    letterSpacing: 0.3,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  footerLoaderText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
