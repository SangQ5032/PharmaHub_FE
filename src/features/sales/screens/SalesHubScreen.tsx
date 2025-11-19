/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

const SalesHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const navigateTo = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý bán hàng</Text>
          <Text style={styles.subtitle}>Chọn chức năng bạn muốn thực hiện</Text>
        </View>

        <View style={styles.menuGrid}>
          {/* Create Invoice */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigateTo(ROUTES.CREATE_INVOICE)}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.cardIconText}>📝</Text>
            </View>
            <Text style={styles.cardTitle}>Tạo Hóa Đơn</Text>
            <Text style={styles.cardDescription}>Tạo hóa đơn bán hàng mới</Text>
          </TouchableOpacity>

          {/* Invoice List */}
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => navigateTo(ROUTES.INVOICE_LIST)}
          >
            <View style={[styles.cardIcon, { backgroundColor: '#F3E5F5' }]}>
              <Text style={styles.cardIconText}>📋</Text>
            </View>
            <Text style={styles.cardTitle}>Danh sách hóa đơn</Text>
            <Text style={styles.cardDescription}>Xem các hóa đơn đã tạo</Text>
          </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  menuGrid: {
    gap: 16,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#999',
  },
});

export default SalesHubScreen;
