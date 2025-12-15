import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useBranches } from '@features/branches';
import { useAuthStore } from '@features/auth';
import { useEmployeeManagement, useAllEmployees } from '../index';
import { Employee } from '../types/types';

interface BranchEmployeeListScreenProps {
  route: {
    params?: {
      branchId: string;
      branchName?: string;
    };
  };
  navigation?: any;
}

const BranchEmployeeListScreen: React.FC<BranchEmployeeListScreenProps> = ({
  route,
  navigation,
}) => {
  const branchId = route.params?.branchId || '';
  const branchName = route.params?.branchName || 'Chi tiết chi nhánh';

  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [selectedTargetBranch, setSelectedTargetBranch] =
    React.useState<string>('');
  const [showActionModal, setShowActionModal] = React.useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = React.useState(false);
  const [_actionType, setActionType] = React.useState<'transfer' | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [addEmployeeSearchQuery, setAddEmployeeSearchQuery] =
    React.useState('');

  const { data: branchesData, isLoading: isLoadingBranches } = useBranches();
  const branches = useMemo(() => branchesData || [], [branchesData]);

  const { user } = useAuthStore();
  const isSystemAdmin = user?.role === 'system-admin';

  const {
    employees: employeesRaw,
    isLoadingEmployees,
    handleTransferBranch,
    handleAssignBranch,
  } = useEmployeeManagement(branchId);
  const employees = useMemo(
    () => (employeesRaw as unknown as Employee[]) || [],
    [employeesRaw],
  );

  const { employees: allEmployeesRaw } = useAllEmployees();
  const allEmployees = useMemo(
    () => (allEmployeesRaw as unknown as Employee[]) || [],
    [allEmployeesRaw],
  );

  // Get employees not in this branch (can be added or transferred)
  const availableEmployees = useMemo(() => {
    return allEmployees.filter((emp: Employee) => {
      // Exclude current branch employees
      if (emp.branch_id === branchId) return false;
      // Include employees without branch (null) or with different branch
      return true;
    });
  }, [allEmployees, branchId]);

  // Filter available employees by search
  const filteredAvailableEmployees = useMemo(() => {
    if (!addEmployeeSearchQuery.trim()) return availableEmployees;

    return availableEmployees.filter(
      (emp: Employee) =>
        emp.name.toLowerCase().includes(addEmployeeSearchQuery.toLowerCase()) ||
        emp.username
          .toLowerCase()
          .includes(addEmployeeSearchQuery.toLowerCase()),
    );
  }, [availableEmployees, addEmployeeSearchQuery]);

  // Filter employees by search
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;

    return employees.filter(
      (emp: Employee) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [employees, searchQuery]);

  const handleSelectTransfer = (employee: Employee) => {
    setSelectedEmployee(employee);
    setActionType('transfer');
    setSelectedTargetBranch('');
    setShowActionModal(true);
  };

  const handleAddEmployee = async (employee: Employee) => {
    try {
      const result = await handleAssignBranch(employee._id, branchId);

      if (result.success) {
        Alert.alert('Thành công', `Đã thêm ${employee.name} vào chi nhánh`);
        setShowAddEmployeeModal(false);
        setAddEmployeeSearchQuery('');
      } else {
        Alert.alert('Lỗi', result.error);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const handleExecuteTransfer = async () => {
    if (!selectedEmployee || !selectedTargetBranch) {
      Alert.alert('Lỗi', 'Vui lòng chọn chi nhánh đích');
      return;
    }

    try {
      const result = await handleTransferBranch(
        selectedEmployee._id,
        selectedTargetBranch,
      );

      if (result.success) {
        Alert.alert(
          'Thành công',
          `Đã chuyển ${selectedEmployee.name} sang chi nhánh mới`,
        );
        setShowActionModal(false);
        setSelectedEmployee(null);
      } else {
        Alert.alert('Lỗi', result.error);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  const renderEmployeeItem = (employee: Employee) => (
    <View key={employee._id} style={styles.employeeItem}>
      <View style={styles.employeeInfo}>
        <Icon name="account" size={24} color="#007AFF" />
        <View style={styles.employeeDetails}>
          <Text style={styles.employeeName}>{employee.name}</Text>
          <Text style={styles.employeeUsername}>@{employee.username}</Text>
          {employee.contact?.phone && (
            <Text style={styles.employeePhone}>{employee.contact.phone}</Text>
          )}
          {employee.contact?.email && (
            <Text style={styles.employeeEmail}>{employee.contact.email}</Text>
          )}
        </View>
      </View>
      <View style={styles.employeeActions}>
        {isSystemAdmin && (
          <TouchableOpacity
            style={[styles.actionButton, styles.transferButton]}
            onPress={() => handleSelectTransfer(employee)}
          >
            <Icon name="swap-horizontal" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Chuyển</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoadingEmployees || isLoadingBranches) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>{branchName}</Text>
            <View style={styles.employeeCountBadge}>
              <Text style={styles.employeeCountText}>
                {employees.length} nhân viên
              </Text>
            </View>
          </View>
          {isSystemAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddEmployeeModal(true)}
            >
              <Icon name="plus" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Thêm</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Employees List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredEmployees.length > 0 ? (
          <View style={styles.employeeList}>
            {filteredEmployees.map((emp: Employee) => renderEmployeeItem(emp))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Không tìm thấy nhân viên'
                : 'Không có nhân viên trong chi nhánh này'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Transfer Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chuyển Chi Nhánh</Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedEmployee && (
              <View style={styles.selectedEmployeeInfo}>
                <Text style={styles.modalLabel}>Nhân viên:</Text>
                <Text style={styles.modalValue}>{selectedEmployee.name}</Text>
                <Text style={styles.modalLabel}>Chi nhánh hiện tại:</Text>
                <Text style={styles.modalValue}>
                  {selectedEmployee.branch_id
                    ? branches.find(
                        (b: any) => b._id === selectedEmployee.branch_id,
                      )?.name
                    : 'Chưa gán chi nhánh'}
                </Text>
              </View>
            )}

            <View style={styles.branchSelector}>
              <Text style={styles.modalLabel}>Chọn chi nhánh đích:</Text>
              <ScrollView style={styles.branchList} nestedScrollEnabled>
                {branches
                  .filter((b: any) => b._id !== selectedEmployee?.branch_id)
                  .map((branch: any) => (
                    <TouchableOpacity
                      key={branch._id}
                      style={[
                        styles.branchOption,
                        selectedTargetBranch === branch._id &&
                          styles.branchOptionSelected,
                      ]}
                      onPress={() => setSelectedTargetBranch(branch._id)}
                    >
                      <View
                        style={[
                          styles.branchCheckbox,
                          selectedTargetBranch === branch._id &&
                            styles.branchCheckboxSelected,
                        ]}
                      >
                        {selectedTargetBranch === branch._id && (
                          <Icon name="check" size={16} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.branchOptionName}>{branch.name}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleExecuteTransfer}
                disabled={!selectedTargetBranch}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Employee Modal */}
      <Modal
        visible={showAddEmployeeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddEmployeeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Nhân Viên</Text>
              <TouchableOpacity onPress={() => setShowAddEmployeeModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.addEmployeeSearch}>
              <Icon name="magnify" size={20} color="#999" />
              <TextInput
                style={styles.addEmployeeInput}
                placeholder="Tìm kiếm nhân viên..."
                value={addEmployeeSearchQuery}
                onChangeText={setAddEmployeeSearchQuery}
                placeholderTextColor="#999"
              />
              {addEmployeeSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setAddEmployeeSearchQuery('')}>
                  <Icon name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.createUserButton}
              onPress={() => navigation?.navigate('CREATE_EMPLOYEE')}
            >
              <Icon name="account-plus" size={20} color="#fff" />
              <Text style={styles.createUserButtonText}>
                Thêm Mới Nhân Viên
              </Text>
            </TouchableOpacity>

            <ScrollView style={styles.employeeSelectList} nestedScrollEnabled>
              {filteredAvailableEmployees.length > 0 ? (
                filteredAvailableEmployees.map((emp: Employee) => (
                  <View key={emp._id} style={styles.employeeSelectItem}>
                    <View style={styles.employeeSelectInfo}>
                      <Icon name="account" size={24} color="#007AFF" />
                      <View style={styles.employeeSelectDetails}>
                        <Text style={styles.employeeSelectName}>
                          {emp.name}
                        </Text>
                        <Text style={styles.employeeSelectUsername}>
                          @{emp.username}
                        </Text>
                        {emp.contact?.phone && (
                          <Text style={styles.employeeSelectPhone}>
                            {emp.contact.phone}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.employeeSelectActions}>
                      {!emp.branch_id ? (
                        <TouchableOpacity
                          style={[styles.actionButton, styles.addActionButton]}
                          onPress={() => handleAddEmployee(emp)}
                        >
                          <Icon name="plus" size={18} color="#fff" />
                          <Text style={styles.actionButtonText}>Thêm</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <View style={styles.currentBranchBadge}>
                            <Text style={styles.currentBranchText}>
                              {
                                branches.find(
                                  (b: any) => b._id === emp.branch_id,
                                )?.name
                              }
                            </Text>
                          </View>
                          {isSystemAdmin && (
                            <TouchableOpacity
                              style={[
                                styles.actionButton,
                                styles.transferButton,
                              ]}
                              onPress={() => {
                                setSelectedEmployee(emp);
                                setActionType('transfer');
                                setSelectedTargetBranch('');
                                setShowActionModal(true);
                              }}
                            >
                              <Icon
                                name="swap-horizontal"
                                size={18}
                                color="#fff"
                              />
                              <Text style={styles.actionButtonText}>
                                Chuyển
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Icon name="account-search" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>
                    {addEmployeeSearchQuery.trim()
                      ? 'Không tìm thấy nhân viên'
                      : 'Tất cả nhân viên đều đã được gán chi nhánh'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#34C759',
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  employeeCountBadge: {
    backgroundColor: '#E7F3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  employeeCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  employeeList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden' as const,
  },
  employeeItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  employeeInfo: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
  },
  employeeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  employeeUsername: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  employeePhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  employeeEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  employeeActions: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  transferButton: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedEmployeeInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  branchSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  branchList: {
    maxHeight: 250,
  },
  branchOption: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  branchOptionSelected: {
    backgroundColor: '#E7F3FF',
    borderColor: '#007AFF',
  },
  branchCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchCheckboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  branchOptionName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row' as const,
    paddingHorizontal: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Add Employee Modal styles
  addEmployeeSearch: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addEmployeeInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  employeeSelectList: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  employeeSelectItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  employeeSelectInfo: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
  },
  employeeSelectDetails: {
    marginLeft: 12,
    flex: 1,
  },
  employeeSelectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  employeeSelectUsername: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  employeeSelectPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  currentBranchBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentBranchText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
  },
  employeeSelectActions: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
  },
  addActionButton: {
    backgroundColor: '#34C759',
  },
  createUserButton: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
    gap: 8,
  },
  createUserButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  roleButtonGroup: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  roleButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E7F3FF',
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#007AFF',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
} as const;

export default BranchEmployeeListScreen;
