import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCreateWeekSchedule } from '@features/work-schdule/hooks/useWorkSchedule';
import { WeekScheduleItem } from '@features/work-schdule/types/types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { useBranchUsers } from '@shared/hooks/useUsers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScheduleInput extends WeekScheduleItem {
  key: string;
}

interface Employee {
  _id: string;
  username: string;
  name: string;
  role: string;
}

export default function CreateWeekScheduleScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { mutate: createWeekSchedule, isPending } = useCreateWeekSchedule();
  const { data: usersData, isLoading: usersLoading } = useBranchUsers();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleInput[]>([
    { key: '1', user_id: '', date: '', shift: 'morning', note: '' },
  ]);
  const [selectedEmployeeModal, setSelectedEmployeeModal] = useState(false);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null,
  );
  const [tempDateForPicker, setTempDateForPicker] = useState(new Date());
  const [defaultMorningEmployee, setDefaultMorningEmployee] =
    useState<string>('');
  const [defaultAfternoonEmployee, setDefaultAfternoonEmployee] =
    useState<string>('');
  const [selectingDefaultShift, setSelectingDefaultShift] = useState<
    'morning' | 'afternoon' | null
  >(null);

  // Get employees from users data
  const employees: Employee[] = useMemo(() => {
    if (usersData?.data && Array.isArray(usersData.data)) {
      return usersData.data as Employee[];
    }
    return [];
  }, [usersData]);

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    return employees.filter(
      emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [employees, searchQuery]);
  const handleFromDateChange = (event: any, date?: Date) => {
    if (date) {
      setFromDate(date);
      setShowFromPicker(false);
    }
  };

  const handleToDateChange = (event: any, date?: Date) => {
    if (date) {
      setToDate(date);
      setShowToPicker(false);
    }
  };

  const generateSchedulesForDateRange = () => {
    // Get date strings in YYYY-MM-DD format directly from local dates
    const startDateString = fromDate.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
    const endDateString = toDate.toLocaleDateString('en-CA');

    if (startDateString > endDateString) {
      Alert.alert('Lỗi', 'Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }

    const newSchedules: ScheduleInput[] = [];
    let keyCounter = 1;

    // Parse dates properly without timezone issues
    const [startYear, startMonth, startDay] = startDateString
      .split('-')
      .map(Number);
    const [endYear, endMonth, endDay] = endDateString.split('-').map(Number);

    const current = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    while (current <= end) {
      const dateString = current.toLocaleDateString('en-CA');

      // Sáng
      newSchedules.push({
        key: keyCounter.toString(),
        user_id: defaultMorningEmployee,
        date: dateString,
        shift: 'morning',
        note: '',
      });
      keyCounter++;

      // Chiều
      newSchedules.push({
        key: keyCounter.toString(),
        user_id: defaultAfternoonEmployee,
        date: dateString,
        shift: 'afternoon',
        note: '',
      });
      keyCounter++;

      current.setDate(current.getDate() + 1);
    }

    if (newSchedules.length > 0) {
      setSchedules(newSchedules);
    } else {
      Alert.alert('Lỗi', 'Vui lòng chọn khoảng thời gian hợp lệ');
    }
  };

  const addSchedule = () => {
    const newKey = (
      Math.max(...schedules.map(s => parseInt(s.key, 10) || 0)) + 1
    ).toString();
    setSchedules([
      ...schedules,
      { key: newKey, user_id: '', date: '', shift: 'morning', note: '' },
    ]);
  };

  const removeSchedule = (key: string) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter(s => s.key !== key));
    } else {
      Alert.alert('Lỗi', 'Phải có ít nhất một lịch');
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    if (selectingDefaultShift) {
      if (selectingDefaultShift === 'morning') {
        setDefaultMorningEmployee(employee._id);
      } else {
        setDefaultAfternoonEmployee(employee._id);
      }
      setSelectedEmployeeModal(false);
      setSelectingDefaultShift(null);
      setSearchQuery('');
    } else if (selectedScheduleIndex !== null) {
      const newSchedules = [...schedules];
      newSchedules[selectedScheduleIndex].user_id = employee._id;
      setSchedules(newSchedules);
      setSelectedEmployeeModal(false);
      setSelectedScheduleIndex(null);
      setSearchQuery('');
    }
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    if (selectedDate && selectedDateIndex !== null) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const newSchedules = [...schedules];
      newSchedules[selectedDateIndex].date = dateString;
      setSchedules(newSchedules);
      setShowDatePicker(false);
      setSelectedDateIndex(null);
    } else {
      setShowDatePicker(false);
      setSelectedDateIndex(null);
    }
  };

  const handleDateButtonPress = (index: number) => {
    setSelectedDateIndex(index);
    if (schedules[index].date) {
      const [year, month, day] = schedules[index].date.split('-').map(Number);
      setTempDateForPicker(new Date(year, month - 1, day));
    } else {
      setTempDateForPicker(new Date());
    }
    setShowDatePicker(true);
  };

  const handleCreateSchedule = () => {
    if (!user?.branch_id) {
      Alert.alert('Lỗi', 'Bạn chưa được gán chi nhánh');
      return;
    }

    const validSchedules = schedules.filter(s => s.user_id && s.date);
    if (validSchedules.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một lịch hợp lệ');
      return;
    }

    const fromString = fromDate.toISOString().split('T')[0];
    const toString = toDate.toISOString().split('T')[0];

    const scheduleData = validSchedules.map(({ _key, ...rest }: any) => rest);

    createWeekSchedule(
      {
        branch_id: user.branch_id,
        from: fromString,
        to: toString,
        schedules: scheduleData,
      },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Đã tạo lịch cho tuần này');
          navigation.goBack();
        },
        onError: (error: any) => {
          Alert.alert(
            'Lỗi',
            error?.response?.data?.message || 'Không thể tạo lịch',
          );
        },
      },
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  const getEmployeeNameById = (userId: string) => {
    const emp = employees.find(e => e._id === userId);
    return emp ? emp.name : 'Chọn nhân viên';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khoảng thời gian</Text>
        <View style={styles.dateRange}>
          <View style={styles.dateGroup}>
            <Text style={styles.label}>Từ ngày</Text>
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>{formatDate(fromDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateGroup}>
            <Text style={styles.label}>Đến ngày</Text>
            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>{formatDate(toDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={handleFromDateChange}
          />
        )}
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={handleToDateChange}
          />
        )}

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateSchedulesForDateRange}
        >
          <Icon name="calendar-multiple" size={18} color="#fff" />
          <Text style={styles.generateButtonText}>Tạo lịch từng ngày</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhân viên mặc định</Text>
        <View style={styles.defaultEmployeeRow}>
          <View style={styles.defaultEmployeeGroup}>
            <Text style={styles.label}>Ca sáng</Text>
            <TouchableOpacity
              style={styles.defaultEmployeeButton}
              onPress={() => {
                setSelectingDefaultShift('morning');
                setSelectedEmployeeModal(true);
              }}
            >
              <Icon name="account" size={16} color="#007AFF" />
              <Text
                style={[
                  styles.defaultEmployeeButtonText,
                  !defaultMorningEmployee && styles.employeeInputPlaceholder,
                ]}
              >
                {getEmployeeNameById(defaultMorningEmployee) ===
                'Chọn nhân viên'
                  ? 'Chọn NV'
                  : getEmployeeNameById(defaultMorningEmployee)}
              </Text>
              <Icon name="chevron-down" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.defaultEmployeeGroup}>
            <Text style={styles.label}>Ca chiều</Text>
            <TouchableOpacity
              style={styles.defaultEmployeeButton}
              onPress={() => {
                setSelectingDefaultShift('afternoon');
                setSelectedEmployeeModal(true);
              }}
            >
              <Icon name="account" size={16} color="#007AFF" />
              <Text
                style={[
                  styles.defaultEmployeeButtonText,
                  !defaultAfternoonEmployee && styles.employeeInputPlaceholder,
                ]}
              >
                {getEmployeeNameById(defaultAfternoonEmployee) ===
                'Chọn nhân viên'
                  ? 'Chọn NV'
                  : getEmployeeNameById(defaultAfternoonEmployee)}
              </Text>
              <Icon name="chevron-down" size={16} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch làm việc</Text>
          <TouchableOpacity onPress={addSchedule} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {usersLoading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          schedules.map((schedule, index) => (
            <View key={schedule.key} style={styles.scheduleCard}>
              <View style={styles.scheduleRow}>
                <TouchableOpacity
                  style={styles.employeeInput}
                  onPress={() => {
                    setSelectedScheduleIndex(index);
                    setSelectedEmployeeModal(true);
                  }}
                >
                  <Icon name="account" size={18} color="#007AFF" />
                  <Text
                    style={[
                      styles.employeeInputText,
                      !schedule.user_id && styles.employeeInputPlaceholder,
                    ]}
                  >
                    {getEmployeeNameById(schedule.user_id)}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#ccc" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeSchedule(schedule.key)}
                  style={styles.removeButton}
                >
                  <Icon name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.scheduleRow}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => handleDateButtonPress(index)}
                >
                  <Icon name="calendar" size={18} color="#007AFF" />
                  <Text
                    style={[
                      styles.dateInputText,
                      !schedule.date && styles.dateInputPlaceholder,
                    ]}
                  >
                    {schedule.date || 'Chọn ngày'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.scheduleRow}>
                <TouchableOpacity
                  style={[
                    styles.shiftButton,
                    schedule.shift === 'morning' && styles.shiftButtonActive,
                  ]}
                  onPress={() => {
                    const newSchedules = [...schedules];
                    newSchedules[index].shift = 'morning';
                    setSchedules(newSchedules);
                  }}
                >
                  <Text
                    style={[
                      styles.shiftButtonText,
                      schedule.shift === 'morning' &&
                        styles.shiftButtonTextActive,
                    ]}
                  >
                    Sáng
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.shiftButton,
                    schedule.shift === 'afternoon' && styles.shiftButtonActive,
                  ]}
                  onPress={() => {
                    const newSchedules = [...schedules];
                    newSchedules[index].shift = 'afternoon';
                    setSchedules(newSchedules);
                  }}
                >
                  <Text
                    style={[
                      styles.shiftButtonText,
                      schedule.shift === 'afternoon' &&
                        styles.shiftButtonTextActive,
                    ]}
                  >
                    Chiều
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, styles.noteInput]}
                placeholder="Ghi chú (tùy chọn)"
                value={schedule.note}
                onChangeText={text => {
                  const newSchedules = [...schedules];
                  newSchedules[index].note = text;
                  setSchedules(newSchedules);
                }}
              />
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        onPress={handleCreateSchedule}
        disabled={isPending}
        style={[styles.submitButton, isPending && styles.submitButtonDisabled]}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Tạo lịch cho tuần</Text>
        )}
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDateForPicker}
          mode="date"
          display="default"
          onChange={handleDatePickerChange}
        />
      )}

      {/* Employee Selection Modal */}
      <Modal
        visible={selectedEmployeeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setSelectedEmployeeModal(false);
          setSearchQuery('');
          setSelectingDefaultShift(null);
          setSelectedScheduleIndex(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn nhân viên</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedEmployeeModal(false);
                  setSearchQuery('');
                  setSelectingDefaultShift(null);
                  setSelectedScheduleIndex(null);
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#ccc"
            />

            <FlatList
              data={filteredEmployees}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.employeeItem}
                  onPress={() => handleSelectEmployee(item)}
                >
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{item.name}</Text>
                    <Text style={styles.employeeRole}>{item.role}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không tìm thấy nhân viên</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  defaultEmployeeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  defaultEmployeeGroup: {
    flex: 1,
  },
  defaultEmployeeButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  defaultEmployeeButtonText: {
    flex: 1,
    fontSize: 12,
    color: '#000',
  },
  dateRange: {
    flexDirection: 'row',
    gap: 12,
  },
  dateGroup: {
    flex: 1,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  generateButton: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  loader: {
    marginTop: 20,
  },
  scheduleCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  scheduleRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  employeeInput: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  employeeInputText: {
    flex: 1,
    fontSize: 12,
    color: '#000',
  },
  employeeInputPlaceholder: {
    color: '#999',
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  dateInputText: {
    flex: 1,
    fontSize: 12,
    color: '#000',
  },
  dateInputPlaceholder: {
    color: '#999',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  noteInput: {
    marginBottom: 0,
  },
  shiftButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  shiftButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  shiftButtonText: {
    fontSize: 12,
    color: '#666',
  },
  shiftButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  searchInput: {
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 14,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  employeeRole: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});
