/**
 * SystemAdminTopMedicinesScreen - Top selling medicines across all branches
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
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSystemAdminTopSellingMedicines } from '../hooks/useSystemAdminStats';
import { FilterDateRange } from '../components';
import {
  formatCurrency,
  formatNumber,
  getCurrentMonthDateRange,
  formatDateForAPI,
} from '../utils/system-admin.utils';

interface TopMedicinesScreenProps {
  navigation: any;
  route?: any;
}

const SystemAdminTopMedicinesScreen: React.FC<TopMedicinesScreenProps> = ({
  navigation,
  route,
}) => {
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
  const [limit, setLimit] = useState(20);

  const { data, isLoading, isError, error, refetch } =
    useSystemAdminTopSellingMedicines({
      startDate,
      endDate,
      limit: Math.max(10, Math.min(100, limit)),
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

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    let medicines = [...(data?.data || [])];

    if (searchQuery) {
      medicines = medicines.filter(m =>
        m.medicineName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return medicines;
  }, [data, searchQuery]);

  const totals = useMemo(() => {
    return filteredMedicines.reduce(
      (acc, med) => ({
        totalQuantity: acc.totalQuantity + med.totalQuantity,
        totalRevenue: acc.totalRevenue + med.totalRevenue,
      }),
      { totalQuantity: 0, totalRevenue: 0 },
    );
  }, [filteredMedicines]);

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
          <Text style={styles.title}>Top Thuốc Bán Chạy</Text>
          <Text style={styles.subtitle}>Toàn hệ thống</Text>
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
            <Text style={styles.summaryLabel}>Tổng Số Lượng</Text>
            <Text style={styles.summaryValue}>
              {formatNumber(totals.totalQuantity)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng Doanh Thu</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.totalRevenue)}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm thuốc..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />

        {/* Limit Selector */}
        <View style={styles.limitSelector}>
          <Text style={styles.limitLabel}>Hiển thị:</Text>
          <View style={styles.limitOptions}>
            {[10, 20, 50].map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.limitBtn, limit === l && styles.limitBtnActive]}
                onPress={() => setLimit(l)}
              >
                <Text
                  style={[
                    styles.limitBtnText,
                    limit === l && styles.limitBtnTextActive,
                  ]}
                >
                  {l}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medicine List */}
        {filteredMedicines.map((medicine, index) => {
          const revenuePercent =
            (medicine.totalRevenue / (totals.totalRevenue || 1)) * 100;

          return (
            <View key={medicine.medicineId} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>
                    {medicine.medicineName}
                  </Text>
                  <Text style={styles.medicineSubtitle}>
                    {medicine.medicineUnit} • {medicine.timesOrdered} lần bán
                  </Text>
                </View>
              </View>

              <View style={styles.medicineStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Số Lượng</Text>
                  <Text style={styles.statValue}>
                    {formatNumber(medicine.totalQuantity)}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Doanh Thu</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(medicine.totalRevenue)}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Giá Avg</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(medicine.averagePrice)}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Chi Nhánh</Text>
                  <Text style={styles.statValue}>{medicine.branchesCount}</Text>
                </View>
              </View>

              {/* Revenue percentage bar */}
              <View style={styles.percentageContainer}>
                <View style={styles.percentageBarContainer}>
                  <View
                    style={[
                      styles.percentageBar,
                      { width: `${Math.min(revenuePercent, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.percentageText}>
                  {revenuePercent.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}

        {filteredMedicines.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Không tìm thấy thuốc</Text>
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
  limitSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  limitLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  limitOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  limitBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  limitBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  limitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  limitBtnTextActive: {
    color: '#fff',
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  medicineSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  medicineStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 4,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  percentageBar: {
    height: '100%',
    backgroundColor: '#FF9800',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
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

export default SystemAdminTopMedicinesScreen;
