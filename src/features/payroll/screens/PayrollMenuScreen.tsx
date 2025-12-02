import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { ROUTES } from '@shared/constants/routes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  route: string;
}

export const PayrollMenuScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  // Debug log
  React.useEffect(() => {
    console.log('=== PayrollMenuScreen Debug ===');
    console.log('User:', user);
    console.log('Role:', role);
  }, [user, role]);

  // Menu options based on role
  const getMenuOptions = (): MenuOption[] => {
    const baseOptions: MenuOption[] = [];

    if (role === 'system-admin') {
      return [
        {
          id: 'payroll-list',
          title: 'Danh sách bảng lương',
          description:
            'Xem danh sách bảng lương của tất cả nhân viên toàn hệ thống',
          icon: 'file-document-multiple',
          iconColor: '#fff',
          bgColor: '#1976d2',
          route: ROUTES.PAYROLL_LIST,
        },
        {
          id: 'branch-payroll-list',
          title: 'Bảng lương theo chi nhánh',
          description: 'Xem bảng lương của từng chi nhánh',
          icon: 'office-building',
          iconColor: '#fff',
          bgColor: '#9C27B0',
          route: ROUTES.PAYROLL_BRANCH_SELECTION,
        },
        {
          id: 'payroll-summary',
          title: 'Báo cáo lương',
          description: 'Xem báo cáo tổng hợp lương toàn hệ thống',
          icon: 'chart-line',
          iconColor: '#fff',
          bgColor: '#FF9800',
          route: ROUTES.PAYROLL_SUMMARY,
        },
      ];
    } else if (role === 'branch-manager') {
      return [
        {
          id: 'payroll-list',
          title: 'Danh sách bảng lương',
          description:
            'Xem danh sách bảng lương của tất cả nhân viên chi nhánh',
          icon: 'file-document-multiple',
          iconColor: '#fff',
          bgColor: '#1976d2',
          route: ROUTES.PAYROLL_LIST,
        },
        {
          id: 'create-payroll',
          title: 'Tạo bảng lương',
          description: 'Tạo bảng lương mới cho nhân viên',
          icon: 'file-plus',
          iconColor: '#fff',
          bgColor: '#4CAF50',
          route: ROUTES.CREATE_PAYROLL,
        },
        {
          id: 'payroll-summary',
          title: 'Báo cáo lương',
          description: 'Xem báo cáo tổng hợp lương chi nhánh',
          icon: 'chart-line',
          iconColor: '#fff',
          bgColor: '#FF9800',
          route: ROUTES.PAYROLL_SUMMARY,
        },
      ];
    } else if (role === 'employee') {
      return [
        {
          id: 'my-payroll',
          title: 'Lương của tôi',
          description: 'Xem thông tin lương và chi tiết tính lương của bạn',
          icon: 'wallet',
          iconColor: '#fff',
          bgColor: '#1976d2',
          route: ROUTES.PAYROLL_LIST,
        },
      ];
    }

    return baseOptions;
  };

  const menuOptions = getMenuOptions();

  const handleMenuPress = (route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản Lý Lương</Text>
        <Text style={styles.headerSubtitle}>
          {role === 'system-admin'
            ? 'Quản lý lương toàn hệ thống'
            : role === 'branch-manager'
            ? 'Quản lý lương cho chi nhánh'
            : 'Xem thông tin lương cá nhân'}
        </Text>
      </View>

      <View style={styles.menuGrid}>
        {menuOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuCard}
            onPress={() => handleMenuPress(option.route)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: option.bgColor },
              ]}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={40}
                color={option.iconColor}
              />
            </View>
            <Text style={styles.menuTitle}>{option.title}</Text>
            <Text style={styles.menuDescription}>{option.description}</Text>
            <View style={styles.arrowContainer}>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#1976d2"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {menuOptions.length === 0 && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="lock" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Bạn không có quyền truy cập</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  menuGrid: {
    padding: 16,
    gap: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  menuDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
    flex: 1,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 12,
  },
});
