import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { useWorkSchedules } from '@features/work-schdule/hooks/useWorkSchedule';
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

export default function WorkScheduleListScreen() {
  const { data, isLoading, error, refetch } = useWorkSchedules();
  const [refreshing, setRefreshing] = useState(false);

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

  // Get day of week in Vietnamese
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

  // Get employee name
  const getEmployeeName = (userId: string | any) => {
    if (typeof userId === 'string') {
      return userId;
    }
    return userId?.name || 'N/A';
  };

  // Group schedules by date
  const groupedSchedules: GroupedSchedule[] = useMemo(() => {
    const schedulesByDate: SchedulesByDate = {};

    // First, organize schedules by date
    schedules.forEach((schedule: WorkSchedule) => {
      if (!schedulesByDate[schedule.date]) {
        schedulesByDate[schedule.date] = [];
      }
      schedulesByDate[schedule.date].push(schedule);
    });

    // Convert to array of GroupedSchedule
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
  }, [schedules]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : groupedSchedules.length > 0 ? (
          <View style={styles.timelineContainer}>
            {groupedSchedules.map((group, index) => (
              <View key={group.date} style={styles.timelineItem}>
                {/* Timeline dot and line */}
                <View style={styles.timelineMarker}>
                  <View style={styles.timelineDot} />
                  {index < groupedSchedules.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.timelineContent}>
                  {/* Date Header */}
                  <View style={styles.dateHeader}>
                    <Text style={styles.dayOfWeek}>📅 {group.dayOfWeek}</Text>
                    <Text style={styles.dateText}>{group.date}</Text>
                  </View>

                  {/* Shift Items */}
                  <View style={styles.shiftsContainer}>
                    {/* Morning Shift */}
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

                    {/* Afternoon Shift */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
