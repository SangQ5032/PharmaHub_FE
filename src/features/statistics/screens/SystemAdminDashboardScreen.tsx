/**
 * SystemAdminDashboardScreen - Main dashboard for system admin
 * Hiển thị toàn bộ thống kê toàn hệ thống
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSystemAdminDashboard } from '../hooks/useSystemAdminStats';
import { StatCard, FilterDateRange } from '../components';
import {
  formatCurrency,
  formatNumber,
  getCurrentMonthDateRange,
  formatDateForAPI,
} from '../utils/system-admin.utils';

interface DashboardScreenProps {
  navigation: any;
}

const SystemAdminDashboardScreen: React.FC<DashboardScreenProps> = ({
  navigation,
}) => {
  const { startDate: defaultStart, endDate: defaultEnd } =
    getCurrentMonthDateRange();

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { data, isLoading, isError, error, refetch } = useSystemAdminDashboard({
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Lỗi: {error?.message || 'Không thể tải dữ liệu'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dashboardData = data?.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Quản Lý Hệ Thống</Text>
          <Text style={styles.headerSubtitle}>
            Tổng quan doanh số toàn hệ thống
          </Text>
        </View>

        {/* Date Range Filter */}
        <FilterDateRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={() => setShowStartPicker(true)}
          onEndDateChange={() => setShowEndPicker(true)}
        />

        {/* Overall Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Thống Kê Tổng Quan</Text>

          <View style={styles.statsGrid}>
            {dashboardData?.overall && (
              <>
                <View style={styles.statsRow}>
                  <StatCard
                    title="Tổng Doanh Thu"
                    value={dashboardData.overall.totalRevenue}
                    valueFormat="currency"
                    icon="💰"
                    containerStyle={styles.statCardHalf}
                  />
                  <StatCard
                    title="Tổng Hóa Đơn"
                    value={dashboardData.overall.totalInvoices}
                    valueFormat="number"
                    icon="📄"
                    containerStyle={styles.statCardHalf}
                  />
                </View>

                <View style={styles.statsRow}>
                  <StatCard
                    title="Tổng Số Lượng"
                    value={dashboardData.overall.totalQuantity}
                    valueFormat="number"
                    icon="📦"
                    containerStyle={styles.statCardHalf}
                  />
                  <StatCard
                    title="Chi Nhánh"
                    value={dashboardData.overall.totalBranches}
                    valueFormat="number"
                    icon="🏪"
                    containerStyle={styles.statCardHalf}
                  />
                </View>

                <View style={styles.statsRow}>
                  <StatCard
                    title="Avg Giá Trị Hóa Đơn"
                    value={dashboardData.overall.averageInvoiceValue}
                    valueFormat="currency"
                    icon="📈"
                    containerStyle={styles.statCardHalf}
                  />
                  <StatCard
                    title="Chiết Khấu"
                    value={dashboardData.overall.totalDiscount}
                    valueFormat="currency"
                    icon="🏷️"
                    containerStyle={styles.statCardHalf}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Top Medicines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Top Thuốc Bán Chạy</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SystemAdminTopMedicines', {
                  startDate,
                  endDate,
                })
              }
            >
              <Text style={styles.viewAllLink}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.topMedicines &&
            dashboardData.topMedicines.slice(0, 5).map((medicine, index) => (
              <View key={medicine.medicineId} style={styles.listItem}>
                <Text style={styles.listItemRank}>#{index + 1}</Text>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>
                    {medicine.medicineName}
                  </Text>
                  <Text style={styles.listItemSubtitle}>
                    Bán: {formatNumber(medicine.totalQuantity)} | Doanh thu:{' '}
                    {formatCurrency(medicine.totalRevenue)}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Branch Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏪 Hiệu Suất Chi Nhánh</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SystemAdminBranchRevenue', {
                  startDate,
                  endDate,
                })
              }
            >
              <Text style={styles.viewAllLink}>Chi tiết</Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.branchStats &&
            dashboardData.branchStats.slice(0, 5).map(branch => (
              <View key={branch.branchId} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>{branch.branchName}</Text>
                  <Text style={styles.listItemSubtitle}>
                    {formatCurrency(branch.totalRevenue)} •{' '}
                    {branch.totalInvoices} hóa đơn
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {/* Inventory Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📦 Tình Trạng Tồn Kho</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SystemAdminBatchStatus')}
            >
              <Text style={styles.viewAllLink}>Chi tiết</Text>
            </TouchableOpacity>
          </View>

          {dashboardData?.batchStatus && (
            <View style={styles.inventoryGrid}>
              <View
                style={[styles.inventoryCard, { backgroundColor: '#E8F5E9' }]}
              >
                <Text style={styles.inventoryLabel}>Còn Hàng</Text>
                <Text style={[styles.inventoryValue, { color: '#4CAF50' }]}>
                  {formatNumber(dashboardData.batchStatus.summary.inStock)}
                </Text>
              </View>

              <View
                style={[styles.inventoryCard, { backgroundColor: '#FFF3E0' }]}
              >
                <Text style={styles.inventoryLabel}>Sắp Hết Hạn</Text>
                <Text style={[styles.inventoryValue, { color: '#FF9800' }]}>
                  {formatNumber(dashboardData.batchStatus.summary.expiringSoon)}
                </Text>
              </View>

              <View
                style={[styles.inventoryCard, { backgroundColor: '#FFEBEE' }]}
              >
                <Text style={styles.inventoryLabel}>Hết Hàng</Text>
                <Text style={[styles.inventoryValue, { color: '#f44336' }]}>
                  {formatNumber(dashboardData.batchStatus.summary.outOfStock)}
                </Text>
              </View>

              <View
                style={[styles.inventoryCard, { backgroundColor: '#F3E5F5' }]}
              >
                <Text style={styles.inventoryLabel}>Hết Hạn</Text>
                <Text style={[styles.inventoryValue, { color: '#9C27B0' }]}>
                  {formatNumber(dashboardData.batchStatus.summary.expired)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#2196F3' }]}
            onPress={() =>
              navigation.navigate('SystemAdminEmployeeRevenue', {
                startDate,
                endDate,
              })
            }
          >
            <Text style={styles.actionBtnText}>Doanh Thu Nhân Viên</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
            onPress={() =>
              navigation.navigate('SystemAdminRevenueByPeriod', {
                startDate,
                endDate,
              })
            }
          >
            <Text style={styles.actionBtnText}>Biểu Đồ Xu Hướng</Text>
          </TouchableOpacity>
        </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    marginVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2196F3',
  },
  statsGrid: {
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCardHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2196F3',
    marginRight: 12,
    minWidth: 30,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inventoryCard: {
    width: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  inventoryValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default SystemAdminDashboardScreen;
