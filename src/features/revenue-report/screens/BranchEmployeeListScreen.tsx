import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BranchEmployeeStats } from '../types';
import { FAKE_EMPLOYEES } from '../mockdata';
import { branchEmployeeStyles as styles } from '../styles';
import { SearchBar, FilterChips, StatCard, EmployeeCard } from '../components';
import { getEmployeeStatusColor, getEmployeeStatusText } from '../utils';
import { useBranchUsers } from '@shared/hooks/useUsers';

export default function BranchEmployeeListScreen({ route, navigation }: any) {
  const { branchId = '1', branchName = 'Chi nhánh Quận 1' } =
    route?.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'staff' | 'manager'>(
    'all',
  );
  const [selectedStatus, setSelectedStatus] = useState<
    'active' | 'inactive' | 'blocked' | 'all'
  >('all');

  // Fetch real employees data from API
  const { data: usersResponse, isLoading } = useBranchUsers(branchId);
  const usersData = usersResponse?.data || [];

  // Map API response to employee format (fallback to FAKE_EMPLOYEES if no real data)
  const branchEmployees =
    usersData.length > 0
      ? usersData.map((user: any) => ({
          id: user._id,
          branchId: user.branch_id,
          name: user.name,
          phone: user.username || '',
          role: user.role === 'admin' ? 'manager' : 'staff',
          status: 'active',
        }))
      : FAKE_EMPLOYEES.filter(emp => emp.branchId === branchId);

  // Apply search and filters
  const filteredEmployees = branchEmployees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery);
    const matchesRole =
      selectedRole === 'all' || emp.role.toLowerCase().includes(selectedRole);
    const matchesStatus =
      selectedStatus === 'all' || emp.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate stats
  const stats: BranchEmployeeStats = {
    total: branchEmployees.length,
    active: branchEmployees.filter(e => e.status === 'active').length,
    inactive: branchEmployees.filter(e => e.status === 'inactive').length,
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

  // Handle navigation to employee revenue
  const handleEmployeePress = (employeeId: string) => {
    navigation.navigate('EmployeeRevenue', { employeeId });
  };

  // Handle edit employee
  const handleEditEmployee = (employeeId: string, employeeName: string) => {
    Alert.alert(
      'Chỉnh sửa nhân viên',
      `Bạn muốn chỉnh sửa thông tin của ${employeeName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            // TODO: Navigate to edit employee screen
            console.log('Edit employee:', employeeId);
          },
        },
      ],
    );
  };

  // Handle add employee
  const handleAddEmployee = () => {
    Alert.alert('Thêm nhân viên', 'Chức năng thêm nhân viên mới', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => {
          // TODO: Navigate to add employee screen
          console.log('Add new employee');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            Đang tải danh sách nhân viên...
          </Text>
        </View>
      ) : (
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quản lý nhân viên</Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm tên / SĐT / email nhân viên..."
          />

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Chi nhánh:</Text>
              <TouchableOpacity style={styles.filterChip}>
                <Text style={styles.filterChipText}>{branchName}</Text>
              </TouchableOpacity>
            </View>
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
            <TouchableOpacity onPress={handleAddEmployee}>
              <Text style={styles.addButton}>+ Thêm nhân viên</Text>
            </TouchableOpacity>
          </View>

          {/* Branch Section */}
          <View style={styles.branchSection}>
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
                onEditPress={() =>
                  handleEditEmployee(employee.id, employee.name)
                }
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
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
