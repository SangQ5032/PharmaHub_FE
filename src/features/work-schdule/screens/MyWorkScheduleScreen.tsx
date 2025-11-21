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
import { useMyWorkSchedule } from '@features/work-schdule/hooks/useWorkSchedule';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

export default function MyWorkScheduleScreen() {
  const { data, isLoading, error, refetch } = useMyWorkSchedule();
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore(state => state.user);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch làm việc của bạn');
    }
  }, [error]);

  const schedules = Array.isArray(data?.data)
    ? data.data
    : ([data?.data].filter(Boolean) as any[]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Lịch làm việc của tôi</Text>
          <Text style={styles.headerSubtitle}>
            {user?.name || user?.username || 'Bạn'}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : schedules.length > 0 ? (
          schedules.map((schedule: any) => (
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
          <Text style={styles.emptyText}>Bạn chưa có lịch làm việc</Text>
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
  headerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
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
