import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import employeeApi from '../api/employee.api';
import { useAllEmployees } from '../index';

interface CreateEmployeeScreenProps {
  navigation?: any;
}

const CreateEmployeeScreen: React.FC<CreateEmployeeScreenProps> = ({
  navigation,
}) => {
  const { refetch: refetchAllEmployees } = useAllEmployees();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    password_hash: '',
    name: '',
    role: 'employee' as 'employee' | 'branch-manager',
    phone: '',
    email: '',
    salary: '',
  });

  const handleInputChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateEmployee = async () => {
    if (!form.username || !form.password_hash || !form.name) {
      Alert.alert(
        'Lỗi',
        'Vui lòng điền đầy đủ thông tin bắt buộc (Username, Mật khẩu, Họ tên)',
      );
      return;
    }

    if (form.username.length < 3) {
      Alert.alert('Lỗi', 'Username phải có ít nhất 3 ký tự');
      return;
    }

    if (form.password_hash.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const result = await employeeApi.createUser({
        username: form.username,
        password_hash: form.password_hash,
        name: form.name,
        role: form.role,
        contact: {
          phone: form.phone,
          email: form.email,
        },
        salary: form.salary ? parseInt(form.salary, 10) : undefined,
      });

      if (result.success) {
        Alert.alert('Thành công', `Đã tạo nhân viên ${form.name}`, [
          {
            text: 'OK',
            onPress: () => {
              // Refresh employee list and go back
              refetchAllEmployees();
              navigation?.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', result.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi',
        error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo Nhân Viên Mới</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Username */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Username <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập username"
            placeholderTextColor="#ccc"
            value={form.username}
            onChangeText={value => handleInputChange('username', value)}
            editable={!isLoading}
          />
        </View>

        {/* Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Mật khẩu <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={form.password_hash}
              onChangeText={value => handleInputChange('password_hash', value)}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Họ và tên <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#ccc"
            value={form.name}
            onChangeText={value => handleInputChange('name', value)}
            editable={!isLoading}
          />
        </View>

        {/* Role */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Vai trò <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.roleButtonGroup}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                form.role === 'employee' && styles.roleButtonActive,
              ]}
              onPress={() => handleInputChange('role', 'employee')}
              disabled={isLoading}
            >
              <Icon
                name="account"
                size={20}
                color={form.role === 'employee' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  form.role === 'employee' && styles.roleButtonTextActive,
                ]}
              >
                Nhân viên
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                form.role === 'branch-manager' && styles.roleButtonActive,
              ]}
              onPress={() => handleInputChange('role', 'branch-manager')}
              disabled={isLoading}
            >
              <Icon
                name="account-tie"
                size={20}
                color={form.role === 'branch-manager' ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  form.role === 'branch-manager' && styles.roleButtonTextActive,
                ]}
              >
                Quản lý
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={form.email}
            onChangeText={value => handleInputChange('email', value)}
            editable={!isLoading}
          />
        </View>

        {/* Phone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={value => handleInputChange('phone', value)}
            editable={!isLoading}
          />
        </View>

        {/* Salary */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Lương (VND)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lương"
            placeholderTextColor="#ccc"
            keyboardType="number-pad"
            value={form.salary}
            onChangeText={value => handleInputChange('salary', value)}
            editable={!isLoading}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation?.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleCreateEmployee}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="check" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Tạo Mới</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  } as const,
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  spacer: {
    height: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  passwordInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  passwordToggle: {
    paddingHorizontal: 12,
  },
  roleButtonGroup: {
    flexDirection: 'row' as const,
    gap: 10,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row' as const,
    justifyContent: 'center',
    backgroundColor: '#fff',
    gap: 6,
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
  footer: {
    flexDirection: 'row' as const,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 25,
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#34C759',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row' as const,
    justifyContent: 'center',
    gap: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
} as const;

export default CreateEmployeeScreen;
