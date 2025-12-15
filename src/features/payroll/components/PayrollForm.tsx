import React, { useState, useEffect } from 'react';
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
import { usePayrollPreview } from '../hooks/usePayroll';

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

  // Get preview when we have all required info
  const canPreview =
    userId && branchId && month && baseSalary && !isNaN(parseFloat(baseSalary));
  const {
    data: previewResponse,
    isLoading: loadingPreview,
    error: previewError,
  } = usePayrollPreview(
    canPreview ? userId : '',
    canPreview ? branchId : '',
    canPreview ? month : '',
  );
  const preview = previewResponse?.data;

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

        {/* Preview Section */}
        {canPreview && (
          <View style={styles.formGroup}>
            <View style={styles.previewHeader}>
              <Icon name="calculator" size={20} color="#1976d2" />
              <Text style={styles.previewTitle}>Xem trước tính toán</Text>
            </View>

            {loadingPreview ? (
              <View style={styles.previewLoading}>
                <ActivityIndicator size="small" color="#1976d2" />
                <Text style={styles.previewLoadingText}>Đang tính toán...</Text>
              </View>
            ) : previewError ? (
              <View style={styles.previewError}>
                <Icon name="alert-circle" size={20} color="#f44336" />
                <Text style={styles.previewErrorText}>
                  Không thể tải preview. Vui lòng thử lại.
                </Text>
              </View>
            ) : preview ? (
              <View style={styles.previewCard}>
                {/* Thông tin lương */}
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>
                    Thông tin lương
                  </Text>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>
                      Lương cơ bản chuẩn (26 ca):
                    </Text>
                    <Text style={styles.previewValue}>
                      {preview.base_monthly_salary?.toLocaleString('vi-VN') ||
                        preview.base_salary.toLocaleString('vi-VN')}{' '}
                      VND
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>
                      Lương cơ bản đã tính:
                    </Text>
                    <Text style={styles.previewValue}>
                      {preview.base_salary.toLocaleString('vi-VN')} VND
                    </Text>
                  </View>
                </View>

                {/* Thông tin ca làm việc */}
                <View style={styles.previewDivider} />
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>
                    Thông tin ca làm việc
                  </Text>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>
                      Tổng số ca được giao:
                    </Text>
                    <Text style={styles.previewValue}>
                      {preview.total_shifts} ca
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Số ca đã chấm công:</Text>
                    <Text style={styles.previewValue}>
                      {preview.completed_shifts} ca
                    </Text>
                  </View>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>
                      Số ca không checkin:
                    </Text>
                    <Text style={styles.previewValue}>
                      {preview.missed_shifts || 0} ca
                    </Text>
                  </View>
                </View>

                {/* Thông tin phạt */}
                <View style={styles.previewDivider} />
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Thông tin phạt</Text>
                  <View style={styles.previewRow}>
                    <Text style={styles.previewLabel}>Số ca đi muộn:</Text>
                    <Text style={styles.previewValue}>
                      {preview.late_count} ca
                    </Text>
                  </View>
                  {preview.late_penalty_amount > 0 && (
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Phạt đi muộn:</Text>
                      <Text style={[styles.previewValue, styles.negativeValue]}>
                        -{preview.late_penalty_amount.toLocaleString('vi-VN')}{' '}
                        VND
                      </Text>
                    </View>
                  )}
                  {preview.missed_penalty_amount > 0 && (
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>
                        Phạt không đi làm:
                      </Text>
                      <Text style={[styles.previewValue, styles.negativeValue]}>
                        -{preview.missed_penalty_amount.toLocaleString('vi-VN')}{' '}
                        VND
                      </Text>
                    </View>
                  )}
                  {preview.penalty_amount > 0 && (
                    <View style={styles.previewRow}>
                      <Text style={styles.previewLabel}>Tổng phạt:</Text>
                      <Text style={[styles.previewValue, styles.negativeValue]}>
                        -{preview.penalty_amount.toLocaleString('vi-VN')} VND
                      </Text>
                    </View>
                  )}
                </View>

                {/* Thông tin khác */}
                {(preview.bonus_amount > 0 || preview.sales_amount > 0) && (
                  <>
                    <View style={styles.previewDivider} />
                    <View style={styles.previewSection}>
                      <Text style={styles.previewSectionTitle}>
                        Thông tin khác
                      </Text>
                      {preview.bonus_amount > 0 && (
                        <View style={styles.previewRow}>
                          <Text style={styles.previewLabel}>Thưởng:</Text>
                          <Text
                            style={[styles.previewValue, styles.positiveValue]}
                          >
                            +{preview.bonus_amount.toLocaleString('vi-VN')} VND
                          </Text>
                        </View>
                      )}
                      {preview.sales_amount > 0 && (
                        <View style={styles.previewRow}>
                          <Text style={styles.previewLabel}>
                            Doanh số bán hàng:
                          </Text>
                          <Text
                            style={[styles.previewValue, styles.positiveValue]}
                          >
                            +{preview.sales_amount.toLocaleString('vi-VN')} VND
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                )}

                {/* Lương cuối cùng */}
                <View style={styles.previewDivider} />
                <View style={[styles.previewRow, styles.finalSalaryRow]}>
                  <Text style={styles.finalSalaryLabel}>Lương cuối cùng:</Text>
                  <Text style={styles.finalSalaryValue}>
                    {preview.final_salary.toLocaleString('vi-VN')} VND
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

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
  // Preview Styles
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1976d2',
  },
  previewLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    gap: 8,
  },
  previewLoadingText: {
    fontSize: 14,
    color: '#666',
  },
  previewError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    gap: 8,
  },
  previewErrorText: {
    fontSize: 14,
    color: '#f44336',
    flex: 1,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  previewValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
  },
  positiveValue: {
    color: '#4CAF50',
  },
  negativeValue: {
    color: '#f44336',
  },
  warningValue: {
    color: '#FF9800',
    fontWeight: '700',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  previewSection: {
    marginBottom: 4,
  },
  previewSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
  },
  finalSalaryRow: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  finalSalaryLabel: {
    fontSize: 15,
    color: '#1976d2',
    fontWeight: '700',
  },
  finalSalaryValue: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '700',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    flex: 1,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  infoText: {
    fontSize: 12,
    color: '#1565c0',
    flex: 1,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    fontSize: 12,
    color: '#c62828',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorValue: {
    color: '#f44336',
    fontWeight: '700',
  },
});
