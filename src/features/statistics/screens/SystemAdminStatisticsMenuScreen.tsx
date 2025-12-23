/**
 * SystemAdminStatisticsMenuScreen - Menu điều hướng thống kê hệ thống
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAuth } from '@app/providers/AuthProvider';

interface StatisticsMenuScreenProps {
  navigation: any;
}

const StatisticsMenuScreen: React.FC<StatisticsMenuScreenProps> = ({
  navigation,
}) => {
  const { user } = useAuth();

  const menuItems = [
    {
      id: '1',
      title: 'Doanh Thu Chi Nhánh',
      description: 'Xem thống kê doanh thu từng chi nhánh',
      icon: '💰',
      color: '#4CAF50',
      onPress: () => navigation.navigate('SystemAdminBranchRevenueDetailed'),
    },
    {
      id: '2',
      title: 'Dashboard Toàn Hệ Thống',
      description: 'Xem tổng quan thống kê toàn hệ thống',
      icon: '📊',
      color: '#2196F3',
      onPress: () => navigation.navigate('SystemAdminDashboard'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Thống Kê Hệ Thống</Text>
          <Text style={styles.subtitle}>Chọn mục để xem thống kê</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Thông Tin Tài Khoản</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vai trò:</Text>
            <Text style={styles.infoValue}>Quản lý hệ thống</Text>
          </View>
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}
          {user?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Điện thoại:</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  arrow: {
    fontSize: 28,
    color: '#ccc',
    fontWeight: '300',
  },
  infoBox: {
    marginHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(25, 118, 210, 0.1)',
  },
  infoLabel: {
    fontSize: 13,
    color: '#1976D2',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
});

export default StatisticsMenuScreen;
