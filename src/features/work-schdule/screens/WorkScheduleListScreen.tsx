import React, { useState } from 'react';
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

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : schedules.length > 0 ? (
          schedules.map((schedule: WorkSchedule) => (
            <View key={schedule._id} style={styles.scheduleItem}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.date}>{schedule.date}</Text>
                  <Text style={styles.shift}>
                    Ca: {schedule.shift === 'morning' ? 'Sáng' : 'Chiều'}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {typeof schedule.user_id === 'string'
                      ? schedule.user_id
                      : schedule.user_id?.name}
                  </Text>
                </View>
              </View>
              {schedule.note && (
                <Text style={styles.note}>Ghi chú: {schedule.note}</Text>
              )}
            </View>
          ))
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
    padding: 16,
  },
  loader: {
    marginTop: 50,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  shift: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});
