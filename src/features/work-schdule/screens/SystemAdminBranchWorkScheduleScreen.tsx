import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { useWorkScheduleByBranch } from '@features/work-schdule/hooks/useWorkSchedule';
import { WorkSchedule } from '@features/work-schdule/types/types';

interface SchedulesByDate {
  [date: string]: WorkSchedule[];
}

interface GroupedSchedule {
  date: string;
  dayOfWeek: string;
  morning?: WorkSchedule;
  afternoon?: WorkSchedule;
}

export default function SystemAdminBranchWorkScheduleScreen() {
  const route = useRoute();
  const branchId = (route.params as any)?.branchId || '';
  const branchName = (route.params as any)?.branchName || 'Chi nhánh';

  const { data, isLoading, error, refetch } = useWorkScheduleByBranch(branchId);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch làm việc');
    }
  }, [error]);

  const schedules = Array.isArray(data?.data)
    ? data.data
    : ([data?.data].filter(Boolean) as WorkSchedule[]);

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const daysVN = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    return daysVN[date.getDay()];
  };

  const getEmployeeName = (userId: string | any) => {
    if (typeof userId === 'string') {
      return userId;
    }
    return userId?.name || 'N/A';
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const day = date.getDay();
      const diff = date.getDate() - day;
      const weekStart = new Date(date);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      setCurrentWeekStart(weekStart);
    }
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const datesWithSchedules = useMemo(() => {
    const dateSet = new Set<string>();
    schedules.forEach((schedule: WorkSchedule) => {
      dateSet.add(schedule.date);
    });
    return dateSet;
  }, [schedules]);

  const formatDateToShort = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const getWeekRangeText = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const year = currentWeekStart.getFullYear();
    return `${formatDateToShort(currentWeekStart)} - ${formatDateToShort(
      weekEnd,
    )}/${year}`;
  };

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const getCalendarDays = () => {
    const days: Array<{ day: number; date: Date; dateString: string }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      const dateString = formatDateToString(date);
      days.push({
        day: date.getDate(),
        date,
        dateString,
      });
    }

    return days;
  };

  const handleDayPress = (date: Date, dateString: string) => {
    if (selectedDate && formatDateToString(selectedDate) === dateString) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
  };

  const groupedSchedules: GroupedSchedule[] = useMemo(() => {
    const schedulesByDate: SchedulesByDate = {};

    let filteredSchedules = schedules;
    if (selectedDate) {
      const selectedDateString = formatDateToString(selectedDate);
      filteredSchedules = schedules.filter(
        (schedule: WorkSchedule) => schedule.date === selectedDateString,
      );
    }

    filteredSchedules.forEach((schedule: WorkSchedule) => {
      if (!schedulesByDate[schedule.date]) {
        schedulesByDate[schedule.date] = [];
      }
      schedulesByDate[schedule.date].push(schedule);
    });

    return Object.entries(schedulesByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, daySchedules]) => {
        const morningSchedule = daySchedules.find(s => s.shift === 'morning');
        const afternoonSchedule = daySchedules.find(
          s => s.shift === 'afternoon',
        );

        return {
          date,
          dayOfWeek: getDayOfWeek(date),
          morning: morningSchedule,
          afternoon: afternoonSchedule,
        };
      });
  }, [schedules, selectedDate]);

  const calendarDays = getCalendarDays();
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <View style={styles.container}>
      <View style={styles.branchHeader}>
        <Text style={styles.branchTitle}>{branchName}</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>📅 Lịch làm việc</Text>
            {selectedDate && (
              <TouchableOpacity
                onPress={handleClearDate}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={20} color="#FF3B30" />
                <Text style={styles.clearButtonText}>Xóa lọc</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Week Navigation */}
          <View style={styles.weekNavigation}>
            <TouchableOpacity
              onPress={goToPreviousWeek}
              style={styles.weekNavButton}
            >
              <Icon name="chevron-left" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.weekText}>{getWeekRangeText()}</Text>
            <TouchableOpacity
              onPress={goToNextWeek}
              style={styles.weekNavButton}
            >
              <Icon name="chevron-right" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayHeader}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid - Week View */}
          <View style={styles.calendarGrid}>
            {calendarDays.map(dayData => {
              const { day, date, dateString } = dayData;
              const hasSchedule = datesWithSchedules.has(dateString);
              const isSelected =
                selectedDate && formatDateToString(selectedDate) === dateString;
              const isToday = formatDateToString(new Date()) === dateString;

              return (
                <TouchableOpacity
                  key={dateString}
                  style={[
                    styles.calendarDay,
                    isSelected && styles.calendarDaySelected,
                    isToday && !isSelected && styles.calendarDayToday,
                  ]}
                  onPress={() => handleDayPress(date, dateString)}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isSelected && styles.calendarDayTextSelected,
                      isToday && !isSelected && styles.calendarDayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasSchedule && (
                    <View
                      style={[
                        styles.scheduleIndicator,
                        isSelected && styles.scheduleIndicatorSelected,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Schedule List */}
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : groupedSchedules.length > 0 ? (
          <View style={styles.timelineContainer}>
            {groupedSchedules.map((group, index) => (
              <View key={group.date} style={styles.timelineItem}>
                <View style={styles.timelineMarker}>
                  <View style={styles.timelineDot} />
                  {index < groupedSchedules.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.dateHeader}>
                    <Text style={styles.dayOfWeek}>📅 {group.dayOfWeek}</Text>
                    <Text style={styles.dateText}>{group.date}</Text>
                  </View>

                  <View style={styles.shiftsContainer}>
                    <View style={styles.shiftItem}>
                      <Text style={styles.shiftLabel}>☀️ Sáng</Text>
                      <Text style={styles.employeeName}>
                        {group.morning
                          ? getEmployeeName(group.morning.user_id)
                          : '– Chưa gán'}
                      </Text>
                      {group.morning?.note && (
                        <Text style={styles.noteText}>
                          Ghi chú: {group.morning.note}
                        </Text>
                      )}
                    </View>

                    <View style={styles.shiftItem}>
                      <Text style={styles.shiftLabel}>🌙 Chiều</Text>
                      <Text style={styles.employeeName}>
                        {group.afternoon
                          ? getEmployeeName(group.afternoon.user_id)
                          : '– Chưa gán'}
                      </Text>
                      {group.afternoon?.note && (
                        <Text style={styles.noteText}>
                          Ghi chú: {group.afternoon.note}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Không có lịch làm việc</Text>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
              {Platform.OS === 'android' && (
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Đóng</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  branchHeader: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  branchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  calendarSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  weekNavButton: {
    padding: 8,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDaySelected: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  calendarDayToday: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  calendarDayTextToday: {
    color: '#007AFF',
    fontWeight: '700',
  },
  scheduleIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34C759',
  },
  scheduleIndicatorSelected: {
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 16,
    width: 30,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: '#f5f5f5',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    paddingTop: 12,
  },
  dateHeader: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  shiftsContainer: {
    gap: 10,
  },
  shiftItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
  },
  shiftLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  employeeName: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  noteText: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});
