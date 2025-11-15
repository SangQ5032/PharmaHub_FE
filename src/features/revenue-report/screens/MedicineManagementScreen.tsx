import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import { medicineManagementStyles as styles } from '../styles';
import { SearchBar, FilterChips } from '../components';
import { formatCurrency } from '../utils';
import { useMedicineStats, useOverallStats } from '../hooks/useStatistics';
import { MedicineStatsItem } from '../types';

export default function MedicineManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  // Fetch medicine statistics from API
  const {
    data: medicineData,
    isLoading: isLoadingMedicines,
    error: medicineError,
  } = useMedicineStats();
  const { data: overallData, isLoading: isLoadingOverall } = useOverallStats();

  // Extract data from API response
  const medicines = useMemo(
    () => medicineData?.data || [],
    [medicineData?.data],
  );
  const totalMedicines = medicineData?.total || 0;
  const overallStats = overallData?.data;

  // Get unique categories from medicines
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(medicines.map((med: MedicineStatsItem) => med.medicineCategory)),
    ) as string[];
    return ['Tất cả', ...uniqueCategories];
  }, [medicines]);

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine: MedicineStatsItem) => {
      const matchesSearch =
        medicine.medicineName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        medicine._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.medicineCategory
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Tất cả' ||
        medicine.medicineCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchQuery, selectedCategory]);

  const categoryFilters = categories.map(cat => ({
    value: cat,
    label: cat,
  }));

  // Loading state
  if (isLoadingMedicines || isLoadingOverall) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Thống kê thuốc" showBack={true} />
        <View style={[styles.content, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (medicineError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Thống kê thuốc" showBack={true} />
        <View style={[styles.content, styles.centerContainer]}>
          <Text style={styles.errorText}>Không thể tải dữ liệu</Text>
          <Text style={styles.errorSubText}>
            {medicineError.message || 'Đã xảy ra lỗi'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Thống kê thuốc" showBack={true} />

      <ScrollView style={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Tổng quan thống kê bán hàng</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={styles.statValue}>{totalMedicines}</Text>
              <Text style={styles.statLabel}>Loại thuốc</Text>
            </View>
            <View style={[styles.statCard, styles.statCardInStock]}>
              <Text style={styles.statValue}>
                {overallStats?.totalQuantity || 0}
              </Text>
              <Text style={styles.statLabel}>Tổng SL bán</Text>
            </View>
            <View style={[styles.statCard, styles.statCardLowStock]}>
              <Text style={styles.statValue}>
                {overallStats?.totalInvoices || 0}
              </Text>
              <Text style={styles.statLabel}>Hóa đơn</Text>
            </View>
            <View style={[styles.statCard, styles.statCardValue]}>
              <Text style={styles.statValue}>
                {((overallStats?.totalRevenue || 0) / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.statLabel}>Doanh thu</Text>
            </View>
            <View style={[styles.statCard, styles.statCardOutOfStock]}>
              <Text style={styles.statValue}>
                {((overallStats?.totalDiscount || 0) / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.statLabel}>Giảm giá</Text>
            </View>
            <View style={[styles.statCard, styles.statCardExpired]}>
              <Text style={styles.statValue}>
                {((overallStats?.totalTax || 0) / 1000).toFixed(0)}K
              </Text>
              <Text style={styles.statLabel}>Thuế</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo tên thuốc, mã, danh mục..."
        />

        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Danh mục</Text>
          <FilterChips
            filters={categoryFilters}
            selectedValue={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        {/* Medicine List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Danh sách ({filteredMedicines.length})
            </Text>
          </View>

          {filteredMedicines.map((medicine: MedicineStatsItem) => (
            <View key={medicine._id} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>
                    {medicine.medicineName}
                  </Text>
                  <Text style={styles.medicineSku}>Mã: {medicine._id}</Text>
                  <Text style={styles.medicineCategory}>
                    {medicine.medicineCategory}
                  </Text>
                </View>
              </View>

              <View style={styles.medicineBody}>
                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Đơn vị:</Text>
                  <Text style={styles.medicineValue}>
                    {medicine.medicineUnit}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Đơn giá TB:</Text>
                  <Text style={styles.medicinePrice}>
                    {formatCurrency(medicine.averagePrice)}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Đã bán:</Text>
                  <Text style={styles.medicineStock}>
                    {medicine.totalQuantity} {medicine.medicineUnit}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Doanh thu:</Text>
                  <Text style={styles.medicinePrice}>
                    {formatCurrency(medicine.totalRevenue)}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Số lần bán:</Text>
                  <Text style={styles.medicineValue}>
                    {medicine.timesOrdered} lần
                  </Text>
                </View>
              </View>

              <View style={styles.medicineFooter}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.actionButtonTextSecondary,
                    ]}
                  >
                    Chi tiết
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {filteredMedicines.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không tìm thấy thuốc nào</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
