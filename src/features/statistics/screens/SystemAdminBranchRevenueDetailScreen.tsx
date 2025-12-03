/**
 * SystemAdminBranchRevenueDetailScreen - Chi tiết doanh thu 1 chi nhánh
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSystemAdminBranchRevenueDetail } from '../hooks/useSystemAdminStats';
import { FilterDateRange } from '../components';
import { formatCurrency } from '../utils/system-admin.utils';

interface BranchRevenueDetailScreenProps {
  navigation: any;
  route: any;
}

const SystemAdminBranchRevenueDetailScreen: React.FC<
  BranchRevenueDetailScreenProps
> = ({ navigation, route }) => {
  const branchId = route.params?.branchId;
  const branchName = route.params?.branchName;

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminBranchRevenueDetail(branchId, {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

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
          <Text style={styles.errorText}>❌ Lỗi tải dữ liệu</Text>
          <Text style={styles.errorMessage}>
            {error instanceof Error ? error.message : 'Không thể tải dữ liệu'}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const detail = data?.data;

  if (!detail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Không có dữ liệu</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isProfitable = detail.summary.netProfit >= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Quay lại</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Chi Tiết Doanh Thu</Text>
          <Text style={styles.branchName}>{detail.branchName}</Text>
          <Text style={styles.branchInfo}>
            {detail.branchAddress} • {detail.branchPhone}
          </Text>
        </View>

        {/* Date Range Filter */}
        <View style={styles.filterSection}>
          <FilterDateRange
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(start, end) => {
              setDateRange({ startDate: start, endDate: end });
            }}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isProfitable ? '#E8F5E9' : '#FFEBEE',
              },
            ]}
          >
            <Text style={styles.summaryLabel}>Lợi Nhuận Ròng</Text>
            <Text
              style={[
                styles.summaryValue,
                {
                  color: isProfitable ? '#4CAF50' : '#f44336',
                },
              ]}
            >
              {formatCurrency(detail.summary.netProfit)}
            </Text>
            <Text
              style={[
                styles.profitMargin,
                {
                  color: isProfitable ? '#4CAF50' : '#f44336',
                },
              ]}
            >
              {detail.summary.profitMargin}
            </Text>
          </View>
        </View>

        {/* Revenue Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Doanh Thu</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Tổng Doanh Thu</Text>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {formatCurrency(detail.revenue.totalRevenue)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Hóa Đơn</Text>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>
                {detail.revenue.totalInvoices}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Số Lượng</Text>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>
                {detail.revenue.totalQuantity}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Trung Bình/HĐ</Text>
              <Text style={[styles.statValue, { color: '#9C27B0' }]}>
                {formatCurrency(detail.revenue.averageInvoiceValue)}
              </Text>
            </View>
          </View>

          <View style={styles.detailList}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Giảm Giá:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(detail.revenue.totalDiscount)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thuế:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(detail.revenue.totalTax)}
              </Text>
            </View>
          </View>
        </View>

        {/* Expenditure Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💸 Chi Phí</Text>

          {/* Import Cost */}
          <View style={styles.expenditureBox}>
            <Text style={styles.expenditureLabel}>Giá Vốn Hàng Nhập</Text>
            <View style={styles.expenditureContent}>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Tổng Giá Vốn</Text>
                <Text style={styles.expenditureItemValue}>
                  {formatCurrency(detail.expenditure.importCost.totalCost)}
                </Text>
              </View>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Lần Nhập</Text>
                <Text style={styles.expenditureItemValue}>
                  {detail.expenditure.importCost.totalImports}
                </Text>
              </View>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Số Lượng</Text>
                <Text style={styles.expenditureItemValue}>
                  {detail.expenditure.importCost.totalQuantity}
                </Text>
              </View>
            </View>
          </View>

          {/* Salary */}
          <View style={styles.expenditureBox}>
            <Text style={styles.expenditureLabel}>Lương & Thưởng</Text>
            <View style={styles.expenditureContent}>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Tổng Lương</Text>
                <Text style={styles.expenditureItemValue}>
                  {formatCurrency(detail.expenditure.salary.totalSalary)}
                </Text>
              </View>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Nhân Viên</Text>
                <Text style={styles.expenditureItemValue}>
                  {detail.expenditure.salary.totalEmployees}
                </Text>
              </View>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Thưởng</Text>
                <Text style={styles.expenditureItemValue}>
                  {formatCurrency(detail.expenditure.salary.totalBonus)}
                </Text>
              </View>
              <View style={styles.expenditureItem}>
                <Text style={styles.expenditureItemLabel}>Phạt</Text>
                <Text style={styles.expenditureItemValue}>
                  {formatCurrency(detail.expenditure.salary.totalPenalty)}
                </Text>
              </View>
            </View>
          </View>

          {/* Total Expenditure */}
          <View style={styles.totalExpenditureBox}>
            <Text style={styles.totalExpenditureLabel}>Tổng Chi Phí</Text>
            <Text style={styles.totalExpenditureValue}>
              {formatCurrency(detail.expenditure.total)}
            </Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Tóm Tắt</Text>

          <View style={styles.summaryList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Doanh Thu</Text>
              <Text style={[styles.summaryRowValue, { color: '#4CAF50' }]}>
                {formatCurrency(detail.summary.totalRevenue)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Chi Phí</Text>
              <Text style={[styles.summaryRowValue, { color: '#FF9800' }]}>
                {formatCurrency(detail.summary.totalExpenditure)}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
              <Text style={styles.summaryRowLabel}>Lợi Nhuận Ròng</Text>
              <Text
                style={[
                  styles.summaryRowValue,
                  {
                    color: isProfitable ? '#4CAF50' : '#f44336',
                    fontWeight: '700',
                  },
                ]}
              >
                {formatCurrency(detail.summary.netProfit)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryRowLabel}>Tỷ Suất Lợi Nhuận</Text>
              <Text
                style={[
                  styles.summaryRowValue,
                  {
                    color: isProfitable ? '#4CAF50' : '#f44336',
                  },
                ]}
              >
                {detail.summary.profitMargin}
              </Text>
            </View>
          </View>
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
  scrollContent: {
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
    fontSize: 18,
    fontWeight: '700',
    color: '#f44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  branchInfo: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  filterSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  summarySection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profitMargin: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  detailList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  expenditureBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  expenditureLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  expenditureContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  expenditureItem: {
    width: '48%',
    paddingVertical: 8,
  },
  expenditureItemLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  expenditureItemValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalExpenditureBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  totalExpenditureLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
  },
  totalExpenditureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9800',
  },
  summaryList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  summaryRowHighlight: {
    backgroundColor: '#F0F4FF',
  },
  summaryRowLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  summaryRowValue: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default SystemAdminBranchRevenueDetailScreen;
