import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { SortBy, SortOrder } from '../types';
import { FAKE_OVERVIEW, FAKE_BRANCHES } from '../mockdata';
import { branchRevenueStyles as styles } from '../styles';
import type { BranchRevenue } from '../types';
import { SearchBar, StatCard } from '../components';
import { formatCurrency } from '../utils';

export default function BranchRevenueReportScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, _setStartDate] = useState('01/10/2025');
  const [endDate, _setEndDate] = useState('21/10/2025');
  const [sortBy, setSortBy] = useState<SortBy>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter branches based on search query
  const filteredBranches = FAKE_BRANCHES.filter(
    branch =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort branches
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'revenue':
        return (a.revenue - b.revenue) * multiplier;
      case 'invoiceCount':
        return (a.invoiceCount - b.invoiceCount) * multiplier;
      case 'paymentRate':
        return (a.paymentRate - b.paymentRate) * multiplier;
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      default:
        return 0;
    }
  });

  const navigateToEmployeeList = (branch: BranchRevenue) => {
    navigation.navigate('BranchEmployeeList', {
      branchId: branch.id,
      branchName: branch.name,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Báo cáo doanh thu từng chi nhánh
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo tên/mã chi nhánh..."
        />

        {/* Date Filter */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>
            Khoảng: {startDate} - {endDate}
          </Text>
          <Text style={styles.dateLabel}>Kênh: Tất cả</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewContainer}>
          <StatCard
            label="Tổng doanh thu"
            value={formatCurrency(FAKE_OVERVIEW.totalRevenue)}
          />
          <StatCard label="Số hoá đơn" value={FAKE_OVERVIEW.totalInvoices} />
          <StatCard
            label="Tỷ lệ đã thanh"
            value={`${FAKE_OVERVIEW.paymentRate}%`}
          />
        </View>

        {/* Branch List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Chi tiết theo chi nhánh</Text>
          <TouchableOpacity onPress={() => toggleSort('revenue')}>
            <Text style={styles.sortText}>
              Sắp xếp: Doanh thu{' '}
              {sortBy === 'revenue' && (sortOrder === 'desc' ? '↓' : '↑')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Branch List */}
        {sortedBranches.map(branch => (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchInfo}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchAddress}>{branch.address}</Text>
            </View>
            <View style={styles.branchStats}>
              <Text style={styles.branchRevenue}>
                {formatCurrency(branch.revenue)}
              </Text>
              <View style={styles.branchActions}>
                <TouchableOpacity
                  style={styles.actionButtonOutline}
                  onPress={() => navigateToEmployeeList(branch)}
                >
                  <Text style={styles.actionButtonOutlineText}>Nhân viên</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonOutline}>
                  <Text style={styles.actionButtonOutlineText}>Sửa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Branch Details Preview */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Bản đồ chi nhánh (preview)</Text>
          <Text style={styles.previewSubtitle}>
            Click để mở bản đồ chi tiết
          </Text>
          <TouchableOpacity style={styles.previewButton}>
            <Text style={styles.previewButtonText}>Mở</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
