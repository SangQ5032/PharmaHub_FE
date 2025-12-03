/**
 * SystemAdminEmployeeRevenueScreen - Employee performance across all branches
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSystemAdminEmployeeRevenue } from '../hooks/useSystemAdminStats';
import { FilterDateRange } from '../components';
import {
  formatCurrency,
  formatNumber,
  getCurrentMonthDateRange,
  formatDateForAPI,
} from '../utils/system-admin.utils';

interface EmployeeRevenueScreenProps {
  navigation: any;
  route?: any;
}

const SystemAdminEmployeeRevenueScreen: React.FC<
  EmployeeRevenueScreenProps
> = ({ navigation, route }) => {
  const routeParams = route?.params || {};
  const { startDate: defaultStart, endDate: defaultEnd } =
    getCurrentMonthDateRange();

  const [startDate, setStartDate] = useState(
    routeParams.startDate || defaultStart,
  );
  const [endDate, setEndDate] = useState(routeParams.endDate || defaultEnd);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminEmployeeRevenue({
      startDate,
      endDate,
    });

  const handleDateChange = (type: 'start' | 'end', date?: Date) => {
    if (!date) {
      if (type === 'start') setShowStartPicker(false);
      else setShowEndPicker(false);
      return;
    }

    const formattedDate = formatDateForAPI(date);
    if (type === 'start') {
      setStartDate(formattedDate);
      setShowStartPicker(false);
    } else {
      setEndDate(formattedDate);
      setShowEndPicker(false);
    }
  };

  // Get unique branches
  const branches = useMemo(() => {
    const uniqueBranches = new Set(data?.data?.map(e => e.branchName) || []);
    return Array.from(uniqueBranches).sort();
  }, [data]);

  // Filter and sort employees
  const processedEmployees = useMemo(() => {
    let employees = [...(data?.data || [])];

    // Filter by branch
    if (filterBranch) {
      employees = employees.filter(e => e.branchName === filterBranch);
    }

    // Filter by search query
    if (searchQuery) {
      employees = employees.filter(
        e =>
          e.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.employeeUsername.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort by revenue descending
    employees.sort((a, b) => b.totalRevenue - a.totalRevenue);

    return employees;
  }, [data, searchQuery, filterBranch]);

  const totals = useMemo(() => {
    return processedEmployees.reduce(
      (acc, emp) => ({
        totalRevenue: acc.totalRevenue + emp.totalRevenue,
        totalOrders: acc.totalOrders + emp.totalOrders,
        avgOrderValue: acc.avgOrderValue + emp.averageOrderValue,
      }),
      { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    );
  }, [processedEmployees]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Doanh Thu Nhân Viên</Text>
          <Text style={styles.subtitle}>Xếp hạng toàn hệ thống</Text>
        </View>

        {/* Date Range Filter */}
        <FilterDateRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={() => setShowStartPicker(true)}
          onEndDateChange={() => setShowEndPicker(true)}
        />

        {/* Summary Stats */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng Doanh Thu</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.totalRevenue)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng Đơn Hàng</Text>
            <Text style={styles.summaryValue}>
              {formatNumber(totals.totalOrders)}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm nhân viên..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />

        {/* Branch Filter */}
        {branches.length > 0 && (
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.branchFilter}
            >
              <TouchableOpacity
                style={[
                  styles.filterTag,
                  filterBranch === null && styles.filterTagActive,
                ]}
                onPress={() => setFilterBranch(null)}
              >
                <Text
                  style={[
                    styles.filterTagText,
                    filterBranch === null && styles.filterTagTextActive,
                  ]}
                >
                  Tất cả
                </Text>
              </TouchableOpacity>

              {branches.map(branch => (
                <TouchableOpacity
                  key={branch}
                  style={[
                    styles.filterTag,
                    filterBranch === branch && styles.filterTagActive,
                  ]}
                  onPress={() => setFilterBranch(branch)}
                >
                  <Text
                    style={[
                      styles.filterTagText,
                      filterBranch === branch && styles.filterTagTextActive,
                    ]}
                  >
                    {branch}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Employee List */}
        {processedEmployees.map((employee, index) => (
          <View key={employee.employeeId} style={styles.employeeCard}>
            <View style={styles.employeeHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{employee.employeeName}</Text>
                <Text style={styles.employeeDetails}>
                  {employee.branchName} • @{employee.employeeUsername}
                </Text>
              </View>
            </View>

            <View style={styles.employeeStats}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Doanh Thu</Text>
                <Text style={styles.statBoxValue}>
                  {formatCurrency(employee.totalRevenue)}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Đơn Hàng</Text>
                <Text style={styles.statBoxValue}>{employee.totalOrders}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Avg/Đơn</Text>
                <Text style={styles.statBoxValue}>
                  {formatCurrency(employee.averageOrderValue)}
                </Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Qty</Text>
                <Text style={styles.statBoxValue}>
                  {formatNumber(employee.totalQuantity)}
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      (employee.totalRevenue / (totals.totalRevenue || 1)) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}

        {processedEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Không tìm thấy nhân viên</Text>
          </View>
        )}
      </ScrollView>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={new Date(startDate)}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange('start', date)}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={new Date(endDate)}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange('end', date)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginVertical: 16,
  },
  backBtn: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterSection: {
    marginBottom: 12,
  },
  branchFilter: {
    flexDirection: 'row',
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterTagActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  filterTagTextActive: {
    color: '#fff',
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  employeeDetails: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  employeeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statBoxLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  statBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SystemAdminEmployeeRevenueScreen;
