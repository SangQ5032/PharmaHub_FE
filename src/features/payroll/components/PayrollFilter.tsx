import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface PayrollFilterProps {
  onFilterChange: (filters: {
    branchId?: string;
    month?: string;
    status?: string;
    userId?: string;
  }) => void;
  onReset?: () => void;
  autoApply?: boolean; // New prop to auto-apply filters on change
}

export const PayrollFilter: React.FC<PayrollFilterProps> = ({
  onFilterChange,
  onReset,
  autoApply = true,
}) => {
  const [branchId, setBranchId] = useState('');
  const [month, setMonth] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [userId, setUserId] = useState('');

  // Auto-apply filters when any filter changes
  useEffect(() => {
    if (autoApply) {
      const timer = setTimeout(() => {
        onFilterChange({
          branchId: branchId || undefined,
          month: month || undefined,
          status: status,
          userId: userId || undefined,
        });
      }, 500); // Debounce by 500ms to avoid too many API calls

      return () => clearTimeout(timer);
    }
  }, [branchId, month, status, userId, autoApply, onFilterChange]);

  const handleApplyFilters = () => {
    onFilterChange({
      branchId: branchId || undefined,
      month: month || undefined,
      status: status,
      userId: userId || undefined,
    });
  };

  const handleReset = () => {
    setBranchId('');
    setMonth('');
    setStatus(undefined);
    setUserId('');
    onReset?.();
  };

  return (
    <ScrollView
      style={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.filterGroup}>
        <TextInput
          style={styles.filterInput}
          placeholder="Branch ID"
          value={branchId}
          onChangeText={setBranchId}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.filterInput}
          placeholder="Tháng (YYYY-MM)"
          value={month}
          onChangeText={setMonth}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.filterInput}
          placeholder="User ID"
          value={userId}
          onChangeText={setUserId}
          placeholderTextColor="#999"
        />

        <View style={styles.statusContainer}>
          {['pending', 'approved', 'rejected'].map(s => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusButton,
                status === s && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(status === s ? undefined : s)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  status === s && styles.statusButtonTextActive,
                ]}
              >
                {s === 'pending'
                  ? 'Chờ'
                  : s === 'approved'
                  ? 'Duyệt'
                  : 'Từ chối'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!autoApply && (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Lọc</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterGroup: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#333',
    minWidth: 120,
    backgroundColor: '#f9f9f9',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  statusButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  statusButtonText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
});
