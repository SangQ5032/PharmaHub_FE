import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { BranchEmployeeStats } from '../types';
import { FAKE_EMPLOYEES } from '../mockdata';
import { branchEmployeeStyles as styles } from '../styles';
import { SearchBar, FilterChips, StatCard, EmployeeCard } from '../components';
import { getEmployeeStatusColor, getEmployeeStatusText } from '../utils';

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

  // Filter employees by branch
  const branchEmployees = FAKE_EMPLOYEES.filter(
    emp => emp.branchId === branchId,
  );

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Kẻm danh sách nhân viên theo chi nhánh
          </Text>
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
              <Text style={styles.filterChipText}>Tất cả</Text>
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
          <Text style={styles.listTitle}>Danh sách theo chi nhánh</Text>
          <TouchableOpacity>
            <Text style={styles.sortText}>Sắp xếp: Mới nhất</Text>
          </TouchableOpacity>
        </View>

        {/* Branch Section - Chi nhánh Quận 1 */}
        <View style={styles.branchSection}>
          <View style={styles.branchHeader}>
            <Text style={styles.branchName}>
              {branchName} ({filteredEmployees.length} NV)
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {filteredEmployees.map(employee => (
            <EmployeeCard
              key={employee.id}
              name={employee.name}
              role={employee.role}
              phone={employee.phone}
              status={employee.status}
              statusText={getEmployeeStatusText(employee.status as any)}
              statusColor={getEmployeeStatusColor(employee.status as any)}
              showActionButton={employee.status === 'inactive'}
              actionButtonText="Mở"
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.bottomActionButton}>
            <Text style={styles.bottomActionButtonText}>Xuất danh sách</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomActionButton}>
            <Text style={styles.bottomActionButtonText}>Khóa/Mở hàng loạt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomActionButton,
              styles.bottomActionButtonPrimary,
            ]}
          >
            <Text
              style={[
                styles.bottomActionButtonText,
                styles.bottomActionButtonPrimaryText,
              ]}
            >
              Tạo nhân viên
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
