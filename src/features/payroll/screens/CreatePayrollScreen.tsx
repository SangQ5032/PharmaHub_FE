/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCreatePayroll } from '../hooks/usePayroll';
import { PayrollForm } from '../components';
import { CreatePayrollRequest } from '../types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { userApi } from '@shared/services/user.api';

interface Employee {
  _id: string;
  name: string;
  username?: string;
  salary?: number;
}

export const CreatePayrollScreen: React.FC = () => {
  const navigation = useNavigation();
  const authUser = useAuthStore(state => state.user);
  const currentBranchId = authUser?.branch_id;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const { mutate: createPayroll, isPending: creatingLoading } =
    useCreatePayroll();

  // Load employees from API
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      // Get employees from the branch (if branch_manager) or all employees (if system_admin)
      const response = await userApi.getUsersByBranchList(currentBranchId);
      if (response.data) {
        // Convert single user to array if needed
        const employeeList = Array.isArray(response.data)
          ? response.data
          : [response.data];

        // Map to Employee type, ensuring salary is included
        const employees = (employeeList as any[]).map((emp: any) => ({
          _id: emp._id,
          name: emp.name,
          username: emp.username,
          salary: emp.salary || 0,
        }));

        setEmployees(employees);
      }
    } catch (error: any) {
      console.error('Error loading employees:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh sách nhân viên. Vui lòng thử lại.',
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async (formData: CreatePayrollRequest) => {
    createPayroll(formData, {
      onSuccess: () => {
        Alert.alert('Thành công', 'Tạo lương thành công', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Tạo lương thất bại';
        Alert.alert('Lỗi', message);
      },
    });
  };

  if (loadingEmployees && employees.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>
            Đang tải danh sách nhân viên...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PayrollForm
        onSubmit={handleSubmit}
        loading={creatingLoading}
        submitLabel="Tạo lương"
        employees={employees}
        loadingEmployees={loadingEmployees}
        currentBranchId={currentBranchId || ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
