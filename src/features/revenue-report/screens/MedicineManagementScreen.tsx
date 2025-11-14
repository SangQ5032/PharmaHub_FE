import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import {
  FAKE_MEDICINES,
  FAKE_MEDICINE_CATEGORIES,
  FAKE_MEDICINE_STATS,
} from '../mockdata';
import { medicineManagementStyles as styles } from '../styles';
import { SearchBar, FilterChips, StatusBadge } from '../components';
import {
  formatCurrency,
  getMedicineStatusText,
  getMedicineStatusColor,
} from '../utils';

export default function MedicineManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter medicines
  const filteredMedicines = FAKE_MEDICINES.filter(medicine => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Tất cả' || medicine.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || medicine.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'in-stock', label: 'Còn hàng' },
    { value: 'low-stock', label: 'Sắp hết' },
    { value: 'out-of-stock', label: 'Hết hàng' },
    { value: 'expired', label: 'Hết hạn' },
  ];

  const categoryFilters = FAKE_MEDICINE_CATEGORIES.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Quản lý thuốc" showBack={true} />

      <ScrollView style={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Tổng quan kho thuốc</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={styles.statValue}>{FAKE_MEDICINE_STATS.total}</Text>
              <Text style={styles.statLabel}>Tổng thuốc</Text>
            </View>
            <View style={[styles.statCard, styles.statCardInStock]}>
              <Text style={styles.statValue}>
                {FAKE_MEDICINE_STATS.inStock}
              </Text>
              <Text style={styles.statLabel}>Còn hàng</Text>
            </View>
            <View style={[styles.statCard, styles.statCardLowStock]}>
              <Text style={styles.statValue}>
                {FAKE_MEDICINE_STATS.lowStock}
              </Text>
              <Text style={styles.statLabel}>Sắp hết</Text>
            </View>
            <View style={[styles.statCard, styles.statCardOutOfStock]}>
              <Text style={styles.statValue}>
                {FAKE_MEDICINE_STATS.outOfStock}
              </Text>
              <Text style={styles.statLabel}>Hết hàng</Text>
            </View>
            <View style={[styles.statCard, styles.statCardExpired]}>
              <Text style={styles.statValue}>
                {FAKE_MEDICINE_STATS.expired}
              </Text>
              <Text style={styles.statLabel}>Hết hạn</Text>
            </View>
            <View style={[styles.statCard, styles.statCardValue]}>
              <Text style={styles.statValue}>
                {(FAKE_MEDICINE_STATS.totalValue / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.statLabel}>Giá trị kho</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo tên, mã, nhà sản xuất..."
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

        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Trạng thái</Text>
          <FilterChips
            filters={statusFilters}
            selectedValue={selectedStatus}
            onSelect={setSelectedStatus}
          />
        </View>

        {/* Medicine List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Danh sách ({filteredMedicines.length})
            </Text>
          </View>

          {filteredMedicines.map(medicine => (
            <View key={medicine.id} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <Text style={styles.medicineSku}>Mã: {medicine.sku}</Text>
                  <Text style={styles.medicineCategory}>
                    {medicine.category}
                  </Text>
                </View>
                <StatusBadge
                  text={getMedicineStatusText(medicine.status)}
                  backgroundColor={getMedicineStatusColor(medicine.status)}
                />
              </View>

              <View style={styles.medicineBody}>
                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Nhà sản xuất:</Text>
                  <Text style={styles.medicineValue}>
                    {medicine.manufacturer}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Đơn giá:</Text>
                  <Text style={styles.medicinePrice}>
                    {formatCurrency(medicine.price)}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Tồn kho:</Text>
                  <Text
                    style={[
                      styles.medicineStock,
                      medicine.status === 'in-stock'
                        ? styles.stockInStock
                        : medicine.status === 'low-stock'
                        ? styles.stockLowStock
                        : styles.stockOutOfStock,
                    ]}
                  >
                    {medicine.stock} {medicine.unit}
                  </Text>
                </View>

                <View style={styles.medicineRow}>
                  <Text style={styles.medicineLabel}>Hạn sử dụng:</Text>
                  <Text style={styles.medicineValue}>
                    {medicine.expiryDate}
                  </Text>
                </View>

                {medicine.description && (
                  <View style={styles.medicineRow}>
                    <Text style={styles.medicineLabel}>Mô tả:</Text>
                    <Text
                      style={styles.medicineDescriptionValue}
                      numberOfLines={2}
                    >
                      {medicine.description}
                    </Text>
                  </View>
                )}
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
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      styles.actionButtonTextPrimary,
                    ]}
                  >
                    Cập nhật
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
