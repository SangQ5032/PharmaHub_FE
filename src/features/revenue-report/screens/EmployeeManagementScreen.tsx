import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import { BranchEmployeeStats } from '../types';
// import { FAKE_EMPLOYEES } from '../mockdata'; // ⚠️ DEPRECATED: Mock data removed
import { employeeManagementStyles as styles } from '../styles';
import { SearchBar, FilterChips, StatCard, EmployeeCard } from '../components';
import { getEmployeeStatusColor, getEmployeeStatusText } from '../utils';

export default function EmployeeManagementScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'staff' | 'manager'>(
    'all',
  );
  const [selectedStatus, setSelectedStatus] = useState<
    'active' | 'inactive' | 'blocked' | 'all'
  >('all');

  // Apply search and filters
  const employees: any[] = []; // TODO: Replace with actual employee API
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      selectedRole === 'all' ||
      emp.role.toLowerCase().includes(selectedRole) ||
      (selectedRole === 'manager' &&
        emp.role.toLowerCase().includes('quản lý'));
    const matchesStatus =
      selectedStatus === 'all' || emp.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const stats: BranchEmployeeStats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
  };

  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Tạm khóa' },
  ];

  const roleFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'staff', label: 'Nhân viên' },
    { value: 'manager', label: 'Quản lý' },
  ];

  // Handle navigation to employee revenue details
  const handleEmployeePress = (employeeId: string) => {
    navigation.navigate('EmployeeRevenue', { employeeId });
  };

  // Handle edit employee
  const handleEditEmployee = (employeeId: string, employeeName: string) => {
    navigation.navigate('AddEditEmployee', {
      mode: 'edit',
      employeeId,
      employeeName,
    });
  };

  // Handle add new employee
  const handleAddEmployee = () => {
    navigation.navigate('AddEditEmployee', { mode: 'add' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Quản lý nhân viên" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm tên / SĐT / email nhân viên..."
        />

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Vai trò:</Text>
            <FilterChips
              filters={roleFilters}
              selectedValue={selectedRole}
              onSelect={value => setSelectedRole(value as any)}
            />
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Trạng thái:</Text>
            <FilterChips
              filters={statusFilters}
              selectedValue={selectedStatus}
              onSelect={value => setSelectedStatus(value as any)}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard label="Tổng nhân viên" value={stats.total} />
          <StatCard
            label="Hoạt động"
            value={stats.active}
            valueColor="#4CAF50"
          />
          <StatCard
            label="Tạm khóa"
            value={stats.inactive}
            valueColor="#EF5350"
          />
        </View>

        {/* Employee List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Danh sách nhân viên ({filteredEmployees.length})
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddEmployee}
          >
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <View style={styles.employeeList}>
          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              name={employee.name}
              role={employee.role}
              phone={employee.phone}
              status={employee.status}
              statusText={getEmployeeStatusText(employee.status as any)}
              statusColor={getEmployeeStatusColor(employee.status as any)}
              onPress={() => handleEmployeePress(employee.id)}
              onEditPress={() => handleEditEmployee(employee.id, employee.name)}
              showEditButton={true}
            />
          ))}
        </View>

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Không tìm thấy nhân viên nào
            </Text>
            <Text style={styles.emptyStateSubText}>
              Thử thay đổi bộ lọc hoặc tìm kiếm khác
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
