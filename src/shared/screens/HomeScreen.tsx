import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { useMyWorkSchedule } from '@features/work-schdule/hooks/useWorkSchedule';
import { useMyAttendance } from '@features/checkin-checkout/hooks/useAttendance';
import { getRoleConfig, RoleOption } from '@shared/config/roleConfig';
import { ROUTES } from '@shared/constants/routes';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const role = user?.role;
  const { data: mySchedules } = useMyWorkSchedule();
  const { data: attendanceData } = useMyAttendance();

  // Lấy config theo role
  const roleConfig = React.useMemo(() => {
    return getRoleConfig(role);
  }, [role]);

  // Kiểm tra xem nhân viên đã checkin hôm nay chưa
  const hasCheckedInToday = React.useMemo(() => {
    if (!attendanceData?.data) return false;

    const attendances = Array.isArray(attendanceData.data)
      ? attendanceData.data
      : [attendanceData.data];

    const today = new Date().toDateString();
    return attendances.some(att => {
      const attDate = new Date(att.checkin_time).toDateString();
      return attDate === today && att.status === 'checked_in';
    });
  }, [attendanceData]);

  // Lấy lịch làm việc hôm nay
  const todaySchedules = React.useMemo(() => {
    const allSchedules = Array.isArray(mySchedules?.data)
      ? mySchedules.data
      : [];
    return allSchedules.filter(
      s => new Date(s.date).toDateString() === new Date().toDateString(),
    );
  }, [mySchedules]);

  // Tính số lịch theo ca
  const scheduleStats = React.useMemo(() => {
    const morning = todaySchedules.filter(s => s.shift === 'morning').length;
    const afternoon = todaySchedules.filter(
      s => s.shift === 'afternoon',
    ).length;
    return { morning, afternoon, total: morning + afternoon };
  }, [todaySchedules]);

  /**
   * Xử lý khi nhân viên bấm vào "Bán Hàng"
   */
  const handleSalesPress = (route: string) => {
    // Chỉ kiểm tra cho role "employee"
    if (role === 'employee' && !hasCheckedInToday) {
      Alert.alert('Cần Checkin', 'Bạn cần checkin để thực hiện bán hàng', [
        {
          text: 'Huỷ',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            navigation.navigate(ROUTES.CHECKIN_CHECKOUT as never);
          },
        },
      ]);
      return;
    }

    // Nếu đã checkin hoặc không phải employee, navigate bình thường
    navigation.navigate(route as never);
  };

  /**
   * Xử lý navigation cho các route khác nhau
   */
  const handleCardPress = (item: RoleOption) => {
    // Kiểm tra nếu là "Bán Hàng" (staff-3)
    if (item.id === 'staff-3') {
      handleSalesPress(item.route);
      return;
    }

    // Với Payroll routes, có thể thêm logic xác thực token nếu cần
    if (item.route === ROUTES.PAYROLL_LIST) {
      // Payroll list tự động filter dựa vào role của user
      navigation.navigate(ROUTES.PAYROLL_LIST as never);
      return;
    }

    if (item.route === ROUTES.CREATE_PAYROLL) {
      // Create payroll screen
      navigation.navigate(ROUTES.CREATE_PAYROLL as never);
      return;
    }

    // Navigate bình thường cho các route khác
    navigation.navigate(item.route as never);
  };

  const renderFunctionCard = ({ item }: { item: RoleOption }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#4CAF50" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderScheduleItem = ({ item }: any) => {
    const shiftLabels: { [key: string]: string } = {
      morning: 'Ca Sáng',
      afternoon: 'Ca Chiều',
      evening: 'Ca Tối',
      night: 'Ca Đêm',
    };
    return (
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleTimeContainer}>
          <Icon name="clock" size={18} color="#4CAF50" />
          <Text style={styles.scheduleTime}>
            {shiftLabels[item.shift] || item.shift}
          </Text>
        </View>
        {item.note && <Text style={styles.scheduleNote}>{item.note}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Trang chủ"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Work Schedule Section - Only for employee role */}
        {role === 'employee' && (
          <TouchableOpacity
            style={styles.workScheduleSection}
            onPress={() =>
              navigation.navigate(ROUTES.WORK_SCHEDULE_MENU as never)
            }
            activeOpacity={0.8}
          >
            <View style={styles.workScheduleHeader}>
              <View style={styles.workScheduleTitle}>
                <Icon name="calendar-today" size={24} color="#fff" />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.workScheduleHeaderText}>
                    Lịch Làm Việc Hôm Nay
                  </Text>
                  <Text style={styles.scheduleStatsText}>
                    ☀️ Sáng: {scheduleStats.morning} | 🌙 Chiều:{' '}
                    {scheduleStats.afternoon}
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color="#fff" />
            </View>

            {todaySchedules.length > 0 ? (
              <FlatList
                data={todaySchedules}
                renderItem={renderScheduleItem}
                keyExtractor={item => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.scheduleListContent}
              />
            ) : (
              <View style={styles.emptySchedule}>
                <Icon
                  name="calendar-blank"
                  size={32}
                  color="rgba(255,255,255,0.6)"
                />
                <Text style={styles.emptyScheduleText}>
                  Không có lịch hôm nay
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Function Cards */}
        <Text style={styles.sectionLabel}>Chức Năng</Text>
        <FlatList
          data={roleConfig.options}
          renderItem={renderFunctionCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />
      </ScrollView>
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
    paddingBottom: 16,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  workScheduleSection: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  workScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#388E3C',
  },
  workScheduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  workScheduleHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerTextContainer: {
    flex: 1,
  },
  scheduleStatsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  scheduleListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scheduleCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#81C784',
  },
  scheduleTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  scheduleNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 26,
  },
  emptySchedule: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyScheduleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E8F5E9',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
});

export default HomeScreen;
