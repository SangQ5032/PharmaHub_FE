import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '@shared/components/header/Header';
import { getRoleConfig, RoleOption } from '@shared/config/roleConfig';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { useMyAttendance } from '@features/checkin-checkout/hooks/useAttendance';
import { ROUTES } from '@shared/constants/routes';

const EMPLOYEE_SALES_OPTION_IDS = new Set(['staff-4', 'staff-6', 'staff-9']);

const EmployeeSalesHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const role = user?.role;
  const { data: attendanceData } = useMyAttendance();

  const roleConfig = React.useMemo(() => getRoleConfig(role), [role]);

  const options = React.useMemo(() => {
    return roleConfig.options.filter(o => EMPLOYEE_SALES_OPTION_IDS.has(o.id));
  }, [roleConfig.options]);

  const hasCheckedInToday = React.useMemo(() => {
    if (!attendanceData?.data) return false;
    const attendances = Array.isArray(attendanceData.data)
      ? attendanceData.data
      : [attendanceData.data];
    const today = new Date().toDateString();
    return attendances.some(att => {
      if (!att || !att.checkin_time) return false;
      const attDate = new Date(att.checkin_time).toDateString();
      // Kiểm tra: có checkin_time của hôm nay và chưa checkout (checkout_time là null)
      // Bất kể status là gì (checked_in, late, early) - đều coi như đã checkin
      return attDate === today && !att.checkout_time;
    });
  }, [attendanceData]);

  const handleSalesPress = (route: string) => {
    if (role === 'employee' && !hasCheckedInToday) {
      Alert.alert('Cần Checkin', 'Bạn cần checkin để thực hiện bán hàng', [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => navigation.navigate(ROUTES.CHECKIN_CHECKOUT),
        },
      ]);
      return;
    }
    navigation.navigate(route);
  };

  const handleCardPress = (item: RoleOption) => {
    if (item.id === 'staff-4') {
      handleSalesPress(item.route);
      return;
    }
    navigation.navigate(item.route);
  };

  const renderCard = ({ item }: { item: RoleOption }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCardPress(item)}
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
        title="Bán hàng"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={options}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 16 },
  gridContainer: { paddingVertical: 8 },
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
});

export default EmployeeSalesHubScreen;
