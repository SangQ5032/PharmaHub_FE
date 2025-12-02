import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GroupBy } from '../types';
import { formatDate } from '../api/statisticsApi';

interface FilterBarProps {
  onFilterChange: (startDate?: Date, endDate?: Date, groupBy?: GroupBy) => void;
  defaultGroupBy?: GroupBy;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  defaultGroupBy = 'month',
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [groupBy, setGroupBy] = useState<GroupBy>(defaultGroupBy);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleGroupByChange = (newGroupBy: GroupBy) => {
    setGroupBy(newGroupBy);
    onFilterChange(startDate, endDate, newGroupBy);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
      onFilterChange(selectedDate, endDate, groupBy);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
      onFilterChange(startDate, selectedDate, groupBy);
    }
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setGroupBy(defaultGroupBy);
    onFilterChange(undefined, undefined, defaultGroupBy);
  };

  return (
    <View style={styles.container}>
      {/* Group By Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhóm Theo</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.groupByContainer}
        >
          {(['day', 'week', 'month', 'year'] as GroupBy[]).map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.groupByButton,
                groupBy === option && styles.groupByButtonActive,
              ]}
              onPress={() => handleGroupByChange(option)}
            >
              <Text
                style={[
                  styles.groupByButtonText,
                  groupBy === option && styles.groupByButtonTextActive,
                ]}
              >
                {getGroupByLabel(option)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Range Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khoảng Thời Gian</Text>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonLabel}>Từ Ngày</Text>
            <Text style={styles.dateButtonValue}>
              {startDate ? formatDate(startDate) : 'Chọn ngày'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonLabel}>Đến Ngày</Text>
            <Text style={styles.dateButtonValue}>
              {endDate ? formatDate(endDate) : 'Chọn ngày'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}

      {/* iOS Picker Modal Handler */}
      {Platform.OS === 'ios' && (
        <>
          <Modal
            visible={showStartDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowStartDatePicker(false)}
          >
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeader}>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text style={styles.iosModalButton}>Hủy</Text>
                  </TouchableOpacity>
                  <Text style={styles.iosModalTitle}>Chọn Ngày Bắt Đầu</Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text
                      style={[styles.iosModalButton, styles.iosModalButtonDone]}
                    >
                      Xong
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleStartDateChange}
                  textColor="#000"
                />
              </View>
            </View>
          </Modal>

          <Modal
            visible={showEndDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEndDatePicker(false)}
          >
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeader}>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text style={styles.iosModalButton}>Hủy</Text>
                  </TouchableOpacity>
                  <Text style={styles.iosModalTitle}>Chọn Ngày Kết Thúc</Text>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text
                      style={[styles.iosModalButton, styles.iosModalButtonDone]}
                    >
                      Xong
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleEndDateChange}
                  textColor="#000"
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const getGroupByLabel = (groupBy: GroupBy): string => {
  const labels: Record<GroupBy, string> = {
    day: 'Theo Ngày',
    week: 'Theo Tuần',
    month: 'Theo Tháng',
    year: 'Theo Năm',
  };
  return labels[groupBy];
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  groupByContainer: {
    flexDirection: 'row',
  },
  groupByButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  groupByButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  groupByButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  groupByButtonTextActive: {
    color: '#FFF',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  dateButtonLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  dateButtonValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  iosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  iosModalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  iosModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iosModalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  iosModalButton: {
    fontSize: 14,
    color: '#007AFF',
    paddingHorizontal: 8,
  },
  iosModalButtonDone: {
    fontWeight: '600',
  },
});
