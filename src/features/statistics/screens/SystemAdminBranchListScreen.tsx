/**
 * SystemAdminBranchListScreen - Menu lựa chọn xem chi nhánh
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface BranchListScreenProps {
  navigation: any;
}

const SystemAdminBranchListScreen: React.FC<BranchListScreenProps> = ({
  navigation,
}) => {
  const menuItems = [
    {
      id: '1',
      title: 'Doanh Thu Chi Nhánh',
      description:
        'Xem doanh thu chi tiết từng chi nhánh theo khoảng thời gian',
      icon: '💰',
      color: '#4CAF50',
      onPress: () => navigation.navigate('SystemAdminBranchRevenueDetailed'),
    },
    {
      id: '2',
      title: 'Danh Sách Chi Nhánh',
      description: 'Xem thông tin chi tiết từng chi nhánh',
      icon: '🏪',
      color: '#2196F3',
      onPress: () => navigation.navigate('BranchList'),
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chi Nhánh</Text>
          <Text style={styles.subtitle}>
            Chọn mục để xem thông tin chi nhánh
          </Text>
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
  backBtn: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
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
});

export default SystemAdminBranchListScreen;
