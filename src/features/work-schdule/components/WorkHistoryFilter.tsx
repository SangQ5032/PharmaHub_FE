import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  WorkHistoryFilters,
  Shift,
} from '@features/work-schdule/types/workScheduleHistory.types';
import { useAllEmployees, Employee } from '@features/employee-management';

interface WorkHistoryFilterProps {
  filters: WorkHistoryFilters;
  onFiltersChange: (filters: WorkHistoryFilters) => void;
  showBranchFilter?: boolean;
  showUserFilter?: boolean;
}

export const WorkHistoryFilter: React.FC<WorkHistoryFilterProps> = ({
  filters,
  onFiltersChange,
  showBranchFilter = false,
  showUserFilter = false,
}) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy danh sách nhân viên nếu cần filter theo user
  const { employees, isLoading: isLoadingEmployees } = useAllEmployees();

  const handleShiftChange = (shift: Shift | undefined) => {
    onFiltersChange({
      ...filters,
      shift,
      page: 1,
    });
  };

  const handleUserChange = (userId: string | undefined) => {
    onFiltersChange({
      ...filters,
      userId,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
    });
    setModalVisible(false);
  };

  const handleDateChange = (type: 'from' | 'to', date: string) => {
    if (type === 'from') {
      onFiltersChange({
        ...filters,
        fromDate: date,
        page: 1,
      });
    } else {
      onFiltersChange({
        ...filters,
        toDate: date,
        page: 1,
      });
    }
  };

  const activeFilterCount = [
    filters.shift,
    filters.fromDate,
    filters.toDate,
    filters.userId,
    filters.branchId,
  ].filter(Boolean).length;

  return (
    <>
      <View style={[styles.filterButton, { borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.buttonContent}
        >
          <MaterialCommunityIcons
            name="filter-outline"
            size={20}
            color={colors.text}
          />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Bộ lọc
          </Text>
          {activeFilterCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Bộ lọc
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Shift Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Ca làm việc
              </Text>
              <View style={styles.shiftContainer}>
                <TouchableOpacity
                  onPress={() => handleShiftChange('morning')}
                  style={[
                    styles.shiftButton,
                    {
                      backgroundColor:
                        filters.shift === 'morning' ? '#FF9500' : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftButtonText,
                      {
                        color:
                          filters.shift === 'morning' ? '#fff' : colors.text,
                      },
                    ]}
                  >
                    Ca sáng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShiftChange('afternoon')}
                  style={[
                    styles.shiftButton,
                    {
                      backgroundColor:
                        filters.shift === 'afternoon' ? '#5856D6' : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftButtonText,
                      {
                        color:
                          filters.shift === 'afternoon' ? '#fff' : colors.text,
                      },
                    ]}
                  >
                    Ca chiều
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShiftChange(undefined)}
                  style={[
                    styles.shiftButton,
                    {
                      backgroundColor: !filters.shift ? '#34C759' : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.shiftButtonText,
                      {
                        color: !filters.shift ? '#fff' : colors.text,
                      },
                    ]}
                  >
                    Tất cả
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* User Filter */}
            {showUserFilter && (
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Nhân viên
                </Text>
                {isLoadingEmployees ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => handleUserChange(undefined)}
                      style={[
                        styles.userButton,
                        {
                          backgroundColor: !filters.userId
                            ? colors.primary
                            : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.userButtonText,
                          { color: !filters.userId ? '#fff' : colors.text },
                        ]}
                      >
                        Tất cả nhân viên
                      </Text>
                    </TouchableOpacity>

                    <FlatList<Employee>
                      data={employees as Employee[]}
                      renderItem={({ item }: { item: Employee }) => (
                        <TouchableOpacity
                          onPress={() => handleUserChange(item._id)}
                          style={[
                            styles.userButton,
                            {
                              backgroundColor:
                                filters.userId === item._id
                                  ? colors.primary
                                  : colors.card,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.userButtonText,
                              {
                                color:
                                  filters.userId === item._id
                                    ? '#fff'
                                    : colors.text,
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item._id}
                      scrollEnabled={false}
                    />
                  </>
                )}
              </View>
            )}

            {/* Date Range Info */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.text }]}>
                Khoảng ngày
              </Text>
              {filters.fromDate && (
                <Text style={[styles.dateInfo, { color: colors.text }]}>
                  Từ: {filters.fromDate}
                </Text>
              )}
              {filters.toDate && (
                <Text style={[styles.dateInfo, { color: colors.text }]}>
                  Đến: {filters.toDate}
                </Text>
              )}
            </View>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={handleClearFilters}
                style={[styles.clearButton, { backgroundColor: '#FF3B30' }]}
              >
                <Text style={styles.clearButtonText}>Xóa tất cả bộ lọc</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <View
            style={[
              styles.modalFooter,
              { borderTopColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    marginTop: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  shiftContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  shiftButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    alignItems: 'center',
  },
  userButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  dateInfo: {
    fontSize: 13,
    marginVertical: 4,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
