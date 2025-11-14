import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import { useWorkSchedules } from '@features/work-schdule/hooks/useWorkSchedule';
import { WorkSchedule } from '@features/work-schdule/types/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkScheduleScreen = () => {
  const { data, isLoading, error, refetch, isRefetching } = useWorkSchedules();

  const renderScheduleItem = ({ item }: { item: WorkSchedule }) => {
    const user = typeof item.user_id === 'object' ? item.user_id : null;
    const branch = typeof item.branch_id === 'object' ? item.branch_id : null;
    const date = new Date(item.date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <View style={styles.scheduleCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon name="calendar-clock" size={24} color="#4CAF50" />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.userName}>
              {user?.name || 'Người dùng không xác định'}
            </Text>
            <Text style={styles.userRole}>{user?.role || ''}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Icon name="map-marker" size={18} color="#4CAF50" />
            <Text style={styles.infoText}>
              {branch?.name || 'Chi nhánh không xác định'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={18} color="#4CAF50" />
            <Text style={styles.infoText}>{date}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock-outline" size={18} color="#4CAF50" />
            <Text style={styles.shiftText}>{item.shift}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Lịch làm việc" showBack={true} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Lịch làm việc" showBack={true} />
        <View style={styles.centerContainer}>
          <Icon name="alert-circle-outline" size={48} color="#F44336" />
          <Text style={styles.errorText}>Có lỗi xảy ra khi tải dữ liệu</Text>
        </View>
      </View>
    );
  }

  const schedules = data?.data || [];
  const schedulesArray = Array.isArray(schedules) ? schedules : [schedules];

  return (
    <View style={styles.container}>
      <Header title="Lịch làm việc" showBack={true} />
      <View style={styles.content}>
        {schedulesArray.length === 0 ? (
          <View style={styles.centerContainer}>
            <Icon name="calendar-remove" size={64} color="#9E9E9E" />
            <Text style={styles.emptyText}>Chưa có lịch làm việc</Text>
          </View>
        ) : (
          <FlatList
            data={schedulesArray}
            renderItem={renderScheduleItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                colors={['#4CAF50']}
                tintColor="#4CAF50"
              />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: '#757575',
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
  shiftText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 16,
  },
});

export default WorkScheduleScreen;
