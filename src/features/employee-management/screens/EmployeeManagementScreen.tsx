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
import { useEmployeeManagement } from '../index';
import { Employee } from '../types/types';

interface BranchSection {
  branchId: string;
  branchName: string;
  employees: Employee[];
}

const EmployeeManagementScreen: React.FC<{ navigation?: any }> = () => {
  const [expandedBranch, setExpandedBranch] = React.useState<string | null>(
    null,
  );
  const [selectedEmployee, setSelectedEmployee] =
    React.useState<Employee | null>(null);
  const [selectedTargetBranch, setSelectedTargetBranch] =
    React.useState<string>('');
  const [showActionModal, setShowActionModal] = React.useState(false);
  const [actionType, setActionType] = React.useState<
    'assign' | 'transfer' | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBranchId, setSelectedBranchId] = React.useState<string>('');

  const { data: branchesData, isLoading: isLoadingBranches } = useBranches();
  const branches = useMemo(() => branchesData || [], [branchesData]);

  // Set first branch as default
  React.useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0]._id);
    }
  }, [branches, selectedBranchId]);

  const {
    employees,
    isLoadingEmployees,
    handleAssignBranch,
    handleTransferBranch,
  } = useEmployeeManagement(selectedBranchId);

  // Group employees by branch
  const groupedEmployees = useMemo(() => {
    const grouped: Record<string, Employee[]> = {};

    employees.forEach((emp: any) => {
      const branchId = emp.branch_id || 'unassigned';
      if (!grouped[branchId]) {
        grouped[branchId] = [];
      }
      grouped[branchId].push(emp);
    });

    return grouped;
  }, [employees]);

  // Create branch sections
  const branchSections = useMemo<BranchSection[]>(() => {
    const sections: BranchSection[] = [];

    // Add unassigned employees first
    if (groupedEmployees.unassigned) {
      sections.push({
        branchId: 'unassigned',
        branchName: 'Chưa gán chi nhánh',
        employees: groupedEmployees.unassigned,
      });
    }

    // Add employees by branch
    branches.forEach((branch: any) => {
      if (groupedEmployees[branch._id]) {
        sections.push({
          branchId: branch._id,
          branchName: branch.name || branch.branchName,
          employees: groupedEmployees[branch._id],
        });
      }
    });

    return sections;
  }, [groupedEmployees, branches]);

  // Filter employees based on search
  const filteredSections = useMemo<BranchSection[]>(() => {
    if (!searchQuery.trim()) return branchSections;

    return branchSections
      .map(section => ({
        ...section,
        employees: section.employees.filter(
          emp =>
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.username.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter(section => section.employees.length > 0);
  }, [branchSections, searchQuery]);

  const handleSelectAction = (
    employee: Employee,
    type: 'assign' | 'transfer',
  ) => {
    setSelectedEmployee(employee);
    setActionType(type);
    setSelectedTargetBranch('');
    setShowActionModal(true);
  };

  const handleExecuteAction = async () => {
    if (!selectedEmployee || !selectedTargetBranch || !actionType) {
      Alert.alert('Lỗi', 'Vui lòng chọn chi nhánh đích');
      return;
    }

    try {
      let result;
      if (actionType === 'assign') {
        result = await handleAssignBranch(
          selectedEmployee._id,
          selectedTargetBranch,
        );
      } else {
        result = await handleTransferBranch(
          selectedEmployee._id,
          selectedTargetBranch,
        );
      }

      if (result.success) {
        Alert.alert(
          'Thành công',
          actionType === 'assign'
            ? `Đã gán chi nhánh cho ${selectedEmployee.name}`
            : `Đã chuyển ${selectedEmployee.name} sang chi nhánh mới`,
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
        </View>
      </View>
      <View style={styles.employeeActions}>
        {!employee.branch_id ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.assignButton]}
            onPress={() => handleSelectAction(employee, 'assign')}
          >
            <Icon name="plus-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Gán</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.transferButton]}
            onPress={() => handleSelectAction(employee, 'transfer')}
          >
            <Icon name="swap-horizontal" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Chuyển</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderBranchSection = (section: BranchSection) => (
    <View key={section.branchId}>
      <TouchableOpacity
        style={styles.branchHeader}
        onPress={() =>
          setExpandedBranch(
            expandedBranch === section.branchId ? null : section.branchId,
          )
        }
      >
        <Icon
          name={
            expandedBranch === section.branchId
              ? 'chevron-down'
              : 'chevron-right'
          }
          size={24}
          color="#007AFF"
        />
        <Text style={styles.branchName}>{section.branchName}</Text>
        <View style={styles.branchBadge}>
          <Text style={styles.branchBadgeText}>{section.employees.length}</Text>
        </View>
      </TouchableOpacity>

      {expandedBranch === section.branchId && (
        <View style={styles.employeeList}>
          {section.employees.map(emp => renderEmployeeItem(emp))}
        </View>
      )}
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
      {/* Branch Selector */}
      <View style={styles.branchSelectorContainer}>
        <Text style={styles.branchSelectorLabel}>Chi nhánh:</Text>
        <TouchableOpacity
          style={styles.branchDropdown}
          onPress={() => {
            // Simple branch selection - could be improved with a modal
            if (branches.length > 1) {
              const currentIndex = branches.findIndex(
                (b: any) => b._id === selectedBranchId,
              );
              const nextIndex = (currentIndex + 1) % branches.length;
              setSelectedBranchId(branches[nextIndex]._id);
            }
          }}
        >
          <Text style={styles.branchDropdownText}>
            {branches.find((b: any) => b._id === selectedBranchId)?.name ||
              'Chọn chi nhánh'}
          </Text>
          <Icon name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>
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

      {/* Branches List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredSections.length > 0 ? (
          filteredSections.map(section => renderBranchSection(section))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="account-search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'Không tìm thấy nhân viên'
                : 'Không có nhân viên'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {actionType === 'assign' ? 'Gán Chi Nhánh' : 'Chuyển Chi Nhánh'}
              </Text>
              <TouchableOpacity onPress={() => setShowActionModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedEmployee && (
              <View style={styles.selectedEmployeeInfo}>
                <Text style={styles.modalLabel}>Nhân viên:</Text>
                <Text style={styles.modalValue}>{selectedEmployee.name}</Text>
                {selectedEmployee.branch_id && (
                  <>
                    <Text style={styles.modalLabel}>Chi nhánh hiện tại:</Text>
                    <Text style={styles.modalValue}>
                      {
                        branches.find(
                          (b: any) => b._id === selectedEmployee.branch_id,
                        )?.name
                      }
                    </Text>
                  </>
                )}
              </View>
            )}

            <View style={styles.branchSelector}>
              <Text style={styles.modalLabel}>Chọn chi nhánh đích:</Text>
              <ScrollView style={styles.branchList} nestedScrollEnabled>
                {branches.map((branch: any) => (
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
                onPress={handleExecuteAction}
                disabled={!selectedTargetBranch}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
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
  },
  branchHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  branchName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  branchBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  branchBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  employeeList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
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
  assignButton: {
    backgroundColor: '#34C759',
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
  branchSelectorContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
  },
  branchSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  branchDropdown: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  branchDropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
} as const;

export default EmployeeManagementScreen;
