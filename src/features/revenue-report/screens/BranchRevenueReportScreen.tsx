import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SortBy, SortOrder } from '../types';
import { branchRevenueStyles as styles } from '../styles';
import { SearchBar } from '../components';
import { formatCurrency } from '../utils';
import { useBranchStats } from '../hooks/useStatistics';
import { useAuth } from '@app/providers/AuthProvider';

export default function BranchRevenueReportScreen({ navigation }: any) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<string>('2025-01-01');
  const [endDate, setEndDate] = useState<string>('2025-12-31');
  const [sortBy, setSortBy] = useState<SortBy>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date('2025-01-01'));
  const [tempEndDate, setTempEndDate] = useState(new Date('2025-12-31'));

  const { data, isLoading, isError, error } = useBranchStats({
    startDate,
    endDate,
    branchId: user?.branch_id,
  });

  const overviewStats = useMemo(() => {
    if (!data?.data) {
      return {
        totalRevenue: 0,
        totalInvoices: 0,
        averageRevenue: 0,
      };
    }

    const totalRevenue = data.data.reduce(
      (sum, branch) => sum + branch.totalRevenue,
      0,
    );
    const totalInvoices = data.data.reduce(
      (sum, branch) => sum + branch.totalInvoices,
      0,
    );
    const averageRevenue =
      data.data.length > 0 ? totalRevenue / data.data.length : 0;

    return {
      totalRevenue,
      totalInvoices,
      averageRevenue,
    };
  }, [data]);

  // Filter branches based on search query
  const filteredBranches = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter(
      branch =>
        branch.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.branchAddress.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  // Sort branches
  const sortedBranches = useMemo(() => {
    const branches = [...filteredBranches];
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    return branches.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return (a.totalRevenue - b.totalRevenue) * multiplier;
        case 'invoiceCount':
          return (a.totalInvoices - b.totalInvoices) * multiplier;
        case 'quantity':
          return (a.totalQuantity - b.totalQuantity) * multiplier;
        case 'name':
          return a.branchName.localeCompare(b.branchName) * multiplier;
        default:
          return 0;
      }
    });
  }, [filteredBranches, sortBy, sortOrder]);

  // Show error alert
  React.useEffect(() => {
    if (isError && error) {
      Alert.alert(
        'Lỗi',
        'Không thể tải dữ liệu thống kê chi nhánh. Vui lòng thử lại.',
        [{ text: 'OK' }],
      );
    }
  }, [isError, error]);

  const navigateToEmployeeList = (branchId: string, branchName: string) => {
    navigation.navigate('BranchEmployeeList', {
      branchId,
      branchName,
    });
  };

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Handle date picker changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setTempStartDate(selectedDate);
      if (Platform.OS === 'android') {
        setStartDate(selectedDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (event.type === 'set' && selectedDate) {
      setTempEndDate(selectedDate);
      if (Platform.OS === 'android') {
        setEndDate(selectedDate.toISOString().split('T')[0]);
      }
    }
  };

  const confirmStartDate = () => {
    setStartDate(tempStartDate.toISOString().split('T')[0]);
    setShowStartDatePicker(false);
  };

  const confirmEndDate = () => {
    setEndDate(tempEndDate.toISOString().split('T')[0]);
    setShowEndDatePicker(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Báo cáo doanh thu chi nhánh</Text>
          <Text style={styles.headerSubtitle}>
            {user?.role === 'system-admin'
              ? 'Tổng quan hiệu quả kinh doanh toàn hệ thống'
              : 'Tổng quan hiệu quả kinh doanh chi nhánh'}
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsWrapper}>
          <View style={styles.statCardPrimary}>
            <Text style={styles.statCardLabel}>Tổng doanh thu</Text>
            <Text style={styles.statCardValue}>
              {formatCurrency(overviewStats.totalRevenue)}
            </Text>
            <View style={styles.statCardBadge}>
              <Text style={styles.statCardBadgeText}>
                {data?.data?.length || 0} chi nhánh
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCardSecondary}>
              <Text style={styles.statCardSecondaryLabel}>Số hóa đơn</Text>
              <Text style={styles.statCardSecondaryValue}>
                {overviewStats.totalInvoices}
              </Text>
            </View>
            <View style={styles.statCardSecondary}>
              <Text style={styles.statCardSecondaryLabel}>TB/Chi nhánh</Text>
              <Text style={styles.statCardSecondaryValue}>
                {formatCurrency(overviewStats.averageRevenue)}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar - Only for system-admin */}
        {user?.role === 'system-admin' && (
          <View style={styles.searchSection}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Tìm theo tên chi nhánh..."
            />
          </View>
        )}

        {/* Date Filter */}
        <View style={styles.filterSection}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateInfoLabel}>📅 Thời gian</Text>
            <View style={styles.dateButtonsRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{startDate}</Text>
              </TouchableOpacity>
              <Text style={styles.dateInfoValue}>→</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>{endDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Branch List Header */}
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Chi tiết chi nhánh</Text>
            <Text style={styles.listSubtitle}>
              {sortedBranches.length} kết quả
            </Text>
          </View>
        </View>

        {/* Sort Buttons - Only for system-admin */}
        {user?.role === 'system-admin' && (
          <View style={styles.sortSection}>
            <Text style={styles.sortLabel}>Sắp xếp:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sortScrollView}
            >
              <TouchableOpacity
                style={[
                  styles.sortChip,
                  sortBy === 'revenue' && styles.sortChipActive,
                ]}
                onPress={() => toggleSort('revenue')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'revenue' && styles.sortChipTextActive,
                  ]}
                >
                  💰 Doanh thu{' '}
                  {sortBy === 'revenue' && (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortChip,
                  sortBy === 'invoiceCount' && styles.sortChipActive,
                ]}
                onPress={() => toggleSort('invoiceCount')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'invoiceCount' && styles.sortChipTextActive,
                  ]}
                >
                  📋 Hóa đơn{' '}
                  {sortBy === 'invoiceCount' &&
                    (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortChip,
                  sortBy === 'name' && styles.sortChipActive,
                ]}
                onPress={() => toggleSort('name')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'name' && styles.sortChipTextActive,
                  ]}
                >
                  🏢 Tên{' '}
                  {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Branch List */}
        <View style={styles.branchListContainer}>
          {sortedBranches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Không tìm thấy chi nhánh' : 'Chưa có dữ liệu'}
              </Text>
              {searchQuery && (
                <Text style={styles.emptySubtext}>
                  Thử tìm kiếm với từ khóa khác
                </Text>
              )}
            </View>
          ) : (
            sortedBranches.map((branch, index) => (
              <View key={branch._id} style={styles.branchCard}>
                {/* Branch Header */}
                <View style={styles.branchHeader}>
                  <View style={styles.branchIconContainer}>
                    <Text style={styles.branchIcon}>🏢</Text>
                  </View>
                  <View style={styles.branchHeaderInfo}>
                    <View style={styles.branchTitleRow}>
                      <Text style={styles.branchName}>{branch.branchName}</Text>
                      <View style={styles.rankBadge}>
                        <Text style={styles.rankBadgeText}>#{index + 1}</Text>
                      </View>
                    </View>
                    <Text style={styles.branchAddress} numberOfLines={2}>
                      📍 {branch.branchAddress}
                    </Text>
                  </View>
                </View>

                {/* Revenue Display */}
                <View style={styles.revenueSection}>
                  <Text style={styles.revenueLabel}>Doanh thu</Text>
                  <Text style={styles.revenueValue}>
                    {formatCurrency(branch.totalRevenue)}
                  </Text>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statItemIcon}>📦</Text>
                    <Text style={styles.statItemValue}>
                      {branch.totalQuantity}
                    </Text>
                    <Text style={styles.statItemLabel}>Sản phẩm</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statItemIcon}>📋</Text>
                    <Text style={styles.statItemValue}>
                      {branch.totalInvoices}
                    </Text>
                    <Text style={styles.statItemLabel}>Hóa đơn</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statItemIcon}>💵</Text>
                    <Text style={styles.statItemValue}>
                      {branch.totalInvoices > 0
                        ? formatCurrency(
                            Math.round(
                              branch.totalRevenue / branch.totalInvoices,
                            ),
                          )
                        : 'đ0'}
                    </Text>
                    <Text style={styles.statItemLabel}>TB/Đơn</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.branchActions}>
                  {user?.role === 'system-admin' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        navigateToEmployeeList(branch._id, branch.branchName)
                      }
                    >
                      <Text style={styles.actionButtonText}>👥 Nhân viên</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={
                      user?.role === 'system-admin'
                        ? styles.actionButtonSecondary
                        : styles.actionButton
                    }
                  >
                    <Text
                      style={
                        user?.role === 'system-admin'
                          ? styles.actionButtonSecondaryText
                          : styles.actionButtonText
                      }
                    >
                      📊 Chi tiết
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Date Pickers */}
      {Platform.OS === 'ios' ? (
        <>
          <Modal
            visible={showStartDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Chọn ngày bắt đầu</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text style={styles.datePickerCancel}>Hủy</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempStartDate}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  maximumDate={new Date(endDate)}
                />
                <TouchableOpacity
                  style={styles.datePickerConfirmButton}
                  onPress={confirmStartDate}
                >
                  <Text style={styles.datePickerConfirmText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showEndDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <Text style={styles.datePickerTitle}>Chọn ngày kết thúc</Text>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={styles.datePickerCancel}>Hủy</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempEndDate}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  minimumDate={new Date(startDate)}
                />
                <TouchableOpacity
                  style={styles.datePickerConfirmButton}
                  onPress={confirmEndDate}
                >
                  <Text style={styles.datePickerConfirmText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <>
          {showStartDatePicker && (
            <DateTimePicker
              value={tempStartDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
              maximumDate={new Date(endDate)}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={tempEndDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
              minimumDate={new Date(startDate)}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
