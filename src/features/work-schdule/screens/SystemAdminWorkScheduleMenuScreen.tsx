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
import { ROUTES } from '@shared/constants/routes';

interface MenuOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const SystemAdminWorkScheduleMenuScreen = () => {
  const navigation = useNavigation();

  const menuOptions: MenuOption[] = [
    {
      id: '1',
      label: 'Xem lịch làm việc',
      description: 'Xem lịch làm việc theo chi nhánh',
      icon: 'calendar-month',
      route: ROUTES.SYSTEM_ADMIN_WORK_SCHEDULE_BRANCH_SELECTION,
      color: '#007AFF',
    },
    {
      id: '2',
      label: 'Xem lịch sử làm việc',
      description: 'Xem lịch sử làm việc theo chi nhánh',
      icon: 'history',
      route: ROUTES.SYSTEM_ADMIN_WORK_HISTORY_BRANCH_SELECTION,
      color: '#FF9500',
    },
  ];

  const handleMenuPress = (item: MenuOption) => {
    const targetRoute =
      item.id === '1'
        ? ROUTES.SYSTEM_ADMIN_BRANCH_WORK_SCHEDULE
        : ROUTES.SYSTEM_ADMIN_BRANCH_WORK_HISTORY;
    navigation.navigate(item.route as never, { targetRoute } as never);
  };

  const renderMenuItem = (item: MenuOption) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuPress(item)}
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
          <Icon name="calendar-clock" size={48} color="#007AFF" />
          <Text style={styles.headerTitle}>Quản lý Lịch Làm Việc</Text>
          <Text style={styles.headerSubtitle}>
            Xem và quản lý lịch làm việc theo chi nhánh
          </Text>
        </View>

        <View style={styles.menuContainer}>
          {menuOptions.map(option => renderMenuItem(option))}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Icon name="information" size={20} color="#FF9500" />
            <Text style={styles.infoText}>
              Chọn một mục để xem lịch làm việc hoặc lịch sử làm việc của các
              chi nhánh.
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

export default SystemAdminWorkScheduleMenuScreen;
