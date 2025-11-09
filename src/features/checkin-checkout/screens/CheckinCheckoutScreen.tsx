import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import {
  useCheckin,
  useCheckout,
  useMyAttendance,
} from '@features/checkin-checkout/hooks/useAttendance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Attendance } from '@features/checkin-checkout/types/types';

const CheckinCheckoutScreen = () => {
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(
    null,
  );
  const { data: attendanceData, refetch } = useMyAttendance();
  const checkinMutation = useCheckin();
  const checkoutMutation = useCheckout();

  useEffect(() => {
    if (attendanceData?.data) {
      const attendances = Array.isArray(attendanceData.data)
        ? attendanceData.data
        : [attendanceData.data];

      const today = new Date().toDateString();
      const todayRecord = attendances.find(att => {
        const attDate = new Date(att.checkin_time).toDateString();
        return attDate === today && att.status === 'checked_in';
      });

      setTodayAttendance(todayRecord || null);
    }
  }, [attendanceData]);

  const handleCheckin = async () => {
    try {
      await checkinMutation.mutateAsync({});
      Alert.alert('Thành công', 'Checkin thành công!', [
        {
          text: 'OK',
          onPress: () => {
            refetch();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error?.response?.data?.message || 'Có lỗi xảy ra khi checkin',
      );
    }
  };

  const handleCheckout = async () => {
    try {
      await checkoutMutation.mutateAsync({});
      Alert.alert('Thành công', 'Checkout thành công!', [
        {
          text: 'OK',
          onPress: () => {
            refetch();
            setTodayAttendance(null);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error?.response?.data?.message || 'Có lỗi xảy ra khi checkout',
      );
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateWorkingHours = () => {
    if (!todayAttendance?.checkin_time) return 0;
    const checkinTime = new Date(todayAttendance.checkin_time).getTime();
    const now = new Date().getTime();
    const hours = (now - checkinTime) / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10;
  };

  const currentTime = new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isCheckedIn = todayAttendance !== null;
  const isLoading = checkinMutation.isPending || checkoutMutation.isPending;

  return (
    <View style={styles.container}>
      <Header title="Chấm công" showBack={true} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date & Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
          <Text style={styles.timeText}>{currentTime}</Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <Icon
              name={isCheckedIn ? 'check-circle' : 'clock-outline'}
              size={64}
              color={isCheckedIn ? '#4CAF50' : '#9E9E9E'}
            />
          </View>
          <Text style={styles.statusText}>
            {isCheckedIn ? 'Đã checkin' : 'Chưa checkin'}
          </Text>
          {isCheckedIn && todayAttendance?.checkin_time && (
            <Text style={styles.checkinTimeText}>
              Vào lúc: {formatTime(todayAttendance.checkin_time)}
            </Text>
          )}
        </View>

        {/* Working Hours */}
        {isCheckedIn && (
          <View style={styles.workingHoursCard}>
            <Icon name="timer" size={24} color="#4CAF50" />
            <View style={styles.workingHoursContent}>
              <Text style={styles.workingHoursLabel}>Thời gian làm việc</Text>
              <Text style={styles.workingHoursValue}>
                {calculateWorkingHours()} giờ
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!isCheckedIn ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.checkinButton]}
              onPress={handleCheckin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="login" size={24} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Checkin</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.checkoutButton]}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="logout" size={24} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Checkout</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="information-outline" size={20} color="#4CAF50" />
            <Text style={styles.infoText}>
              {isCheckedIn
                ? 'Bạn đã checkin. Nhấn nút Checkout để kết thúc ca làm việc.'
                : 'Nhấn nút Checkin để bắt đầu ca làm việc.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusIconContainer: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  checkinTimeText: {
    fontSize: 14,
    color: '#757575',
  },
  workingHoursCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  workingHoursContent: {
    flex: 1,
  },
  workingHoursLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  workingHoursValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actionContainer: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  checkinButton: {
    backgroundColor: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
});

export default CheckinCheckoutScreen;
