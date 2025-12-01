import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CreatePayrollRequest } from '../types';

interface Employee {
  _id: string;
  name: string;
  username?: string;
  salary?: number;
}

interface PayrollFormProps {
  onSubmit: (data: CreatePayrollRequest) => void;
  initialValues?: Partial<CreatePayrollRequest>;
  loading?: boolean;
  submitLabel?: string;
  employees?: Employee[];
  loadingEmployees?: boolean;
  currentBranchId?: string;
}

const DEFAULT_BONUS = 300000;

export const PayrollForm: React.FC<PayrollFormProps> = ({
  onSubmit,
  initialValues = {},
  loading = false,
  submitLabel = 'Tạo lương',
  employees = [],
  loadingEmployees = false,
  currentBranchId = '',
}) => {
  const [userId, setUserId] = useState(initialValues.user_id || '');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [branchId, setBranchId] = useState(
    initialValues.branch_id || currentBranchId,
  );
  const [month, setMonth] = useState(
    initialValues.month || new Date().toISOString().slice(0, 7),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [baseSalary, setBaseSalary] = useState(
    initialValues.base_salary?.toString() || '',
  );
  const [hasBonus, setHasBonus] = useState(!!initialValues.bonus_amount);
  const [bonusAmount, setBonusAmount] = useState(
    initialValues.bonus_amount?.toString() || DEFAULT_BONUS.toString(),
  );
  const [note, setNote] = useState(initialValues.note || '');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedMonth = selectedDate.toISOString().slice(0, 7);
      setMonth(formattedMonth);
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setUserId(employee._id);
    // Auto-fill base salary from employee's salary
    if (employee.salary) {
      setBaseSalary(employee.salary.toString());
    }
    setShowEmployeeDropdown(false);
  };

  const handleToggleBonus = () => {
    setHasBonus(!hasBonus);
    if (!hasBonus) {
      setBonusAmount(DEFAULT_BONUS.toString());
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!userId.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn nhân viên');
      return;
    }
    if (!branchId.trim()) {
      Alert.alert('Lỗi', 'Chi nhánh không được xác định');
      return;
    }
    if (!month.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn tháng');
      return;
    }
    if (!baseSalary.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lương cơ bản');
      return;
    }

    const data: CreatePayrollRequest = {
      user_id: userId.trim(),
      branch_id: branchId.trim(),
      month: month.trim(),
      base_salary: parseFloat(baseSalary),
      bonus_amount: hasBonus ? parseFloat(bonusAmount || '0') : 0,
      note: note.trim() || undefined,
    };

    onSubmit(data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Employee Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Chọn nhân viên *</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectInput]}
            onPress={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
          >
            <Text
              style={[
                styles.selectInputText,
                !selectedEmployee && styles.placeholder,
              ]}
            >
              {selectedEmployee
                ? selectedEmployee.name
                : 'Nhấn để chọn nhân viên'}
            </Text>
            <Icon name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>

          {showEmployeeDropdown && (
            <View style={styles.dropdown}>
              {loadingEmployees ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#1976d2" />
                  <Text style={styles.loadingText}>
                    Đang tải danh sách nhân viên...
                  </Text>
                </View>
              ) : employees.length > 0 ? (
                <FlatList
                  data={employees}
                  keyExtractor={item => item._id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelectEmployee(item)}
                    >
                      <Text style={styles.dropdownItemText}>{item.name}</Text>
                      {item.username && (
                        <Text style={styles.dropdownItemSubText}>
                          @{item.username}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.emptyDropdownText}>Không có nhân viên</Text>
              )}
            </View>
          )}
        </View>

        {/* Month Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tháng (YYYY-MM) *</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectInput]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.selectInputText}>{month}</Text>
            <Icon name="calendar" size={20} color="#1976d2" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date(month + '-01')}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Base Salary */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lương cơ bản *</Text>
          {selectedEmployee?.salary && (
            <Text style={styles.salaryHint}>
              Lương cơ bản của {selectedEmployee.name}:{' '}
              {selectedEmployee.salary.toLocaleString('vi-VN')} VND
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Nhập lương cơ bản"
            value={baseSalary}
            onChangeText={setBaseSalary}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        {/* Bonus Toggle */}
        <View style={styles.formGroup}>
          <View style={styles.bonusHeader}>
            <Text style={styles.label}>Thưởng</Text>
            <TouchableOpacity
              style={[styles.checkbox, hasBonus && styles.checkboxChecked]}
              onPress={handleToggleBonus}
            >
              {hasBonus && <Icon name="check" size={16} color="#fff" />}
            </TouchableOpacity>
          </View>

          {hasBonus && (
            <View style={styles.bonusInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập số tiền thưởng"
                value={bonusAmount}
                onChangeText={setBonusAmount}
                keyboardType="decimal-pad"
                editable={!loading}
              />
              <View style={styles.bonusHint}>
                <Text style={styles.bonusHintText}>Mặc định: 300,000 VND</Text>
              </View>
            </View>
          )}
        </View>

        {/* Note */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.textAreaInput]}
            placeholder="Nhập ghi chú"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  salaryHint: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectInputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 250,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyDropdownText: {
    padding: 12,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 12,
  },
  bonusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  bonusInputContainer: {
    marginTop: 12,
  },
  bonusHint: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  bonusHintText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  textAreaInput: {
    height: 100,
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
