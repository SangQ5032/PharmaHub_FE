import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Header } from '@shared/components/header/Header';
// import { FAKE_WORK_HISTORY, FAKE_WORK_SUMMARY } from '../mockdata'; // ⚠️ DEPRECATED: Mock data removed
import { workHistoryStyles as styles } from '../styles';
import { SearchBar, FilterChips, StatusBadge } from '../components';
import { getWorkStatusColor, getWorkStatusText, getShiftText } from '../utils';

export default function EmployeeWorkHistoryScreen({ route }: any) {
  const employeeName = route?.params?.employeeName || 'Nguyễn Văn An';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter work history
  const workHistory: any[] = []; // TODO: Replace with actual work history API
  const filteredHistory = workHistory.filter(item => {
    const matchesSearch =
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'on-time', label: 'Đúng giờ' },
    { value: 'late', label: 'Trễ' },
    { value: 'absent', label: 'Vắng' },
    { value: 'working', label: 'Đang làm' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Lịch sử - ${employeeName}`} showBack={true} />

      <ScrollView style={styles.content}>
        {/* Summary Section */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Tổng quan tháng này</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{0}</Text>
              <Text style={styles.summaryLabel}>Tổng ngày</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.summaryValueSuccess]}>
                {0}
              </Text>
              <Text style={styles.summaryLabel}>Đúng giờ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.summaryValueWarning]}>
                {0}
              </Text>
              <Text style={styles.summaryLabel}>Trễ</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.summaryValueError]}>
                {0}
              </Text>
              <Text style={styles.summaryLabel}>Vắng</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryInfoItem}>
              <Text style={styles.summaryInfoLabel}>Tổng giờ làm:</Text>
              <Text style={styles.summaryInfoValue}>{0}h</Text>
            </View>
            <View style={styles.summaryInfoItem}>
              <Text style={styles.summaryInfoLabel}>Trung bình/ngày:</Text>
              <Text style={styles.summaryInfoValue}>{0}h</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm theo ngày hoặc địa điểm..."
        />

        {/* Filter Chips */}
        <FilterChips
          filters={statusFilters}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
        />

        {/* Work History List */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            Lịch sử ({filteredHistory.length})
          </Text>

          {filteredHistory.map(item => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyDateContainer}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyShift}>
                    {getShiftText(item.shift)}
                  </Text>
                </View>
                <StatusBadge
                  text={getWorkStatusText(item.status)}
                  backgroundColor={getWorkStatusColor(item.status)}
                />
              </View>

              <View style={styles.historyBody}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>📍 Địa điểm:</Text>
                  <Text style={styles.historyValue}>{item.location}</Text>
                </View>

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>🕐 Check-in:</Text>
                  <Text style={styles.historyValue}>{item.checkInTime}</Text>
                </View>

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>🕑 Check-out:</Text>
                  <Text style={styles.historyValue}>
                    {item.checkOutTime || '-'}
                  </Text>
                </View>

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>⏱️ Tổng giờ:</Text>
                  <Text style={[styles.historyValue, styles.historyHoursValue]}>
                    {item.totalHours}h
                  </Text>
                </View>

                {item.notes && (
                  <View style={styles.historyNotesContainer}>
                    <Text style={styles.historyNotesLabel}>📝 Ghi chú:</Text>
                    <Text style={styles.historyNotes}>{item.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}

          {filteredHistory.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Không tìm thấy lịch sử làm việc
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
