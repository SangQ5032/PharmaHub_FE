import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterDateRangeProps {
  onFilterChange?: (startDate: string | null, endDate: string | null) => void;
  containerStyle?: ViewStyle;
  showPresets?: boolean;
}

/**
 * Component lọc theo khoảng thời gian
 */
export const FilterDateRange: React.FC<FilterDateRangeProps> = ({
  onFilterChange,
  containerStyle,
  showPresets = true,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Chọn ngày';
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const convertToString = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (
    event: any,
    date?: Date,
    type?: 'start' | 'end',
  ) => {
    // luôn tính next state để tránh gọi onFilterChange với giá trị cũ (stale state)
    let nextStart = startDate;
    let nextEnd = endDate;

    if (type === 'start') {
      setShowStartPicker(false);
      if (date) {
        nextStart = date;
        setStartDate(date);
      }
    } else {
      setShowEndPicker(false);
      if (date) {
        nextEnd = date;
        setEndDate(date);
      }
    }

    onFilterChange?.(convertToString(nextStart), convertToString(nextEnd));
  };

  const handlePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setStartDate(start);
    setEndDate(end);
    onFilterChange?.(convertToString(start), convertToString(end));
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    onFilterChange?.(null, null);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>Lọc theo thời gian</Text>

      {showPresets && (
        <View style={styles.presetsContainer}>
          <TouchableOpacity style={styles.chip} onPress={() => handlePreset(7)}>
            <Text style={styles.chipText}>7 ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handlePreset(30)}
          >
            <Text style={styles.chipText}>30 ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handlePreset(90)}
          >
            <Text style={styles.chipText}>90 ngày</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateButtonText}>Từ: {formatDate(startDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateButtonText}>Đến: {formatDate(endDate)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => handleDateChange(event, date, 'start')}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => handleDateChange(event, date, 'end')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  } as TextStyle,
  presetsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  } as TextStyle,
  datePickerContainer: {
    gap: 8,
  },
  dateButton: {
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fbff',
  },
  dateButtonText: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
  } as TextStyle,
  resetButton: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f7fa',
    borderRadius: 6,
  },
  resetButtonText: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  } as TextStyle,
});
