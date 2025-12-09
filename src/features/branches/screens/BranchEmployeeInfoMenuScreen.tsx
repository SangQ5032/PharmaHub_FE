import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ROUTES } from '@shared/constants/routes';

export default function BranchEmployeeInfoMenuScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { branchId, branchName } = route?.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin nhân viên</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            navigation.navigate(ROUTES.BRANCH_EMPLOYEE_LIST, {
              branchId,
              branchName,
            })
          }
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-group"
              size={32}
              color="#FF9500"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>Quản lý nhân viên</Text>
            <Text style={styles.menuSubtitle}>
              Thêm và quản lý nhân viên trong chi nhánh
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            navigation.navigate(ROUTES.BRANCH_EMPLOYEE_SELECTION, {
              branchId,
              branchName,
              mode: 'work-history',
            })
          }
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="history" size={32} color="#4CAF50" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>Lịch sử làm việc</Text>
            <Text style={styles.menuSubtitle}>
              Xem lịch sử làm việc của nhân viên
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() =>
            navigation.navigate(ROUTES.BRANCH_EMPLOYEE_SELECTION, {
              branchId,
              branchName,
              mode: 'invoice-history',
            })
          }
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={32}
              color="#2196F3"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.menuTitle}>Lịch sử hoá đơn</Text>
            <Text style={styles.menuSubtitle}>
              Xem lịch sử hoá đơn của nhân viên
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  back: {
    color: '#666',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
  },
});
