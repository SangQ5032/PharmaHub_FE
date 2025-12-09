/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBranchUsers } from '@shared/hooks/useUsers';
import { ROUTES } from '@shared/constants/routes';

export default function BranchEmployeeSelectionScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { branchId, branchName, mode } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState('');

  const { data: usersData, isLoading } = useBranchUsers(branchId);
  const employees = usersData?.data || [];

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    return employees.filter(
      (emp: any) =>
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.username?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [employees, searchQuery]);

  const handleSelectEmployee = (employee: any) => {
    if (mode === 'work-history') {
      // Navigate to employee work history
      navigation.navigate(ROUTES.EMPLOYEE_WORK_HISTORY, {
        employeeId: employee._id,
        employeeName: employee.name,
        branchId,
        branchName,
      });
    } else if (mode === 'invoice-history') {
      // Navigate to employee invoice history
      navigation.navigate(ROUTES.EMPLOYEE_INVOICE_HISTORY, {
        employeeId: employee._id,
        employeeName: employee.name,
        branchId,
        branchName,
      });
    }
  };

  const renderEmployeeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.employeeCard}
      onPress={() => handleSelectEmployee(item)}
    >
      <View style={styles.avatarContainer}>
        <MaterialCommunityIcons
          name="account-circle"
          size={40}
          color="#4CAF50"
        />
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name || 'N/A'}</Text>
        <Text style={styles.employeePhone}>{item.username || 'N/A'}</Text>
        {item.role && (
          <Text style={styles.employeeRole}>
            {item.role === 'employee'
              ? 'Nhân viên'
              : item.role === 'branch-manager'
              ? 'Quản lý'
              : 'Admin'}
          </Text>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'work-history' ? 'Chọn nhân viên' : 'Chọn nhân viên'}
        </Text>
        <View style={{ width: 70 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : filteredEmployees.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-off" size={64} color="#999" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Không tìm thấy nhân viên' : 'Chưa có nhân viên nào'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={item => item._id}
          renderItem={renderEmployeeItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {filteredEmployees.length} nhân viên
            </Text>
          }
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  listHeader: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  employeePhone: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
