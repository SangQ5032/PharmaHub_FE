import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SortBy, SortOrder } from '../types';
import { branchRevenueStyles as styles } from '../styles';
import { SearchBar } from '../components';
import { formatCurrency } from '../utils';
import { useBranchStats } from '../hooks/useStatistics';

export default function BranchRevenueReportScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate] = useState<string>('2024-01-01');
  const [endDate] = useState<string>('2024-12-31');
  const [sortBy, setSortBy] = useState<SortBy>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Fetch branch statistics from API
  const { data, isLoading, isError, error } = useBranchStats({
    startDate,
    endDate,
  });

  // Calculate overview stats from branch data
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

  // Show error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Không thể tải dữ liệu thống kê chi nhánh
          </Text>
          <Text style={styles.errorSubtext}>
            Vui lòng kiểm tra kết nối hoặc quyền truy cập
          </Text>
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
            Tổng quan hiệu quả kinh doanh
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

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm theo tên chi nhánh..."
          />
        </View>

        {/* Date Filter */}
        <View style={styles.filterSection}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateInfoLabel}>📅 Thời gian</Text>
            <Text style={styles.dateInfoValue}>
              {startDate} → {endDate}
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>⚙️ Lọc</Text>
          </TouchableOpacity>
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

        {/* Sort Buttons */}
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
                🏢 Tên {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

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
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      navigateToEmployeeList(branch._id, branch.branchName)
                    }
                  >
                    <Text style={styles.actionButtonText}>👥 Nhân viên</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Text style={styles.actionButtonSecondaryText}>
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
    </SafeAreaView>
  );
}
