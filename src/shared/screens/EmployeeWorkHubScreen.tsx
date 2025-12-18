import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '@shared/components/header/Header';
import { useMyWorkSchedule } from '@features/work-schdule/hooks/useWorkSchedule';
import { getRoleConfig, RoleOption } from '@shared/config/roleConfig';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

const EMPLOYEE_WORK_OPTION_IDS = new Set(['staff-1', 'staff-2', 'staff-3']);

const EmployeeWorkHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  const { data: mySchedules } = useMyWorkSchedule();

  const roleConfig = React.useMemo(() => getRoleConfig(role), [role]);

  const options = React.useMemo(() => {
    return roleConfig.options.filter(o => EMPLOYEE_WORK_OPTION_IDS.has(o.id));
  }, [roleConfig.options]);

  const todaySchedules = React.useMemo(() => {
    const allSchedules = Array.isArray(mySchedules?.data)
      ? mySchedules.data
      : [];
    const today = new Date().toDateString();
    return allSchedules.filter(s => new Date(s.date).toDateString() === today);
  }, [mySchedules]);

  const scheduleStats = React.useMemo(() => {
    const morning = todaySchedules.filter(s => s.shift === 'morning').length;
    const afternoon = todaySchedules.filter(
      s => s.shift === 'afternoon',
    ).length;
    return { morning, afternoon, total: morning + afternoon };
  }, [todaySchedules]);

  const renderCard = ({ item }: { item: RoleOption }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#4CAF50" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Công việc"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.workScheduleSection}
          onPress={() => navigation.navigate(ROUTES.WORK_SCHEDULE_MENU)}
          activeOpacity={0.85}
        >
          <View style={styles.workScheduleHeader}>
            <View style={styles.workScheduleTitle}>
              <Icon name="calendar-today" size={22} color="#fff" />
              <View style={styles.headerTextContainer}>
                <Text style={styles.workScheduleHeaderText}>Lịch hôm nay</Text>
                <Text style={styles.scheduleStatsText}>
                  ☀️ Sáng: {scheduleStats.morning} | 🌙 Chiều:{' '}
                  {scheduleStats.afternoon}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#fff" />
          </View>
          <View style={styles.workScheduleBody}>
            <Text style={styles.workScheduleBodyText}>
              Tổng ca hôm nay: {scheduleStats.total}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Chức năng</Text>
        <FlatList
          data={options}
          renderItem={renderCard}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, paddingBottom: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  gridContainer: { paddingHorizontal: 16, paddingVertical: 8 },
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
    shadowOffset: { width: 0, height: 2 },
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
  workScheduleSection: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
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
  headerTextContainer: { flex: 1 },
  workScheduleHeaderText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  scheduleStatsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  workScheduleBody: { paddingHorizontal: 16, paddingVertical: 14 },
  workScheduleBodyText: { color: '#fff', fontWeight: '600' },
});

export default EmployeeWorkHubScreen;
