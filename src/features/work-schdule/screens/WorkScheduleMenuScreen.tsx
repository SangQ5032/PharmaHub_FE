/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { ROUTES } from '@shared/constants/routes';

interface MenuOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const WorkScheduleMenuScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  const allMenuOptions: MenuOption[] = [
    {
      id: '1',
      label: 'Danh sách lịch',
      description: 'Xem tất cả lịch làm việc',
      icon: 'calendar-list',
      route: ROUTES.WORK_SCHEDULE_LIST,
      color: '#007AFF',
    },
    {
      id: '2',
      label: 'Tạo lịch tuần',
      description: 'Tạo lịch cho cả tuần',
      icon: 'calendar-multiple-check',
      route: ROUTES.CREATE_WEEK_SCHEDULE,
      color: '#FF9500',
    },
  ];

  // Filter menu options based on role
  const menuOptions = React.useMemo(() => {
    if (role === 'employee') {
      // Employee only sees "Danh sách lịch"
      return allMenuOptions.filter(option => option.id === '1');
    }
    // branch_manager sees all options
    return allMenuOptions;
  }, [role]);

  const handleMenuPress = (route: string) => {
    navigation.navigate(route as never);
  };

  const renderMenuItem = (item: MenuOption) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={28} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Icon name="calendar-month" size={48} color="#007AFF" />
          <Text style={styles.headerTitle}>Quản lý Lịch Làm Việc</Text>
          <Text style={styles.headerSubtitle}>
            Tạo và quản lý lịch làm việc cho nhân viên
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuOptions.map(option => renderMenuItem(option))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color="#FF9500" />
            <Text style={styles.infoText}>
              Bạn có thể xem danh sách lịch làm việc, tạo lịch cho một ngày hoặc
              tạo lịch cho cả tuần.
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  menuDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default WorkScheduleMenuScreen;
