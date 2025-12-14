/**
 * ChangePasswordForm Component
 * Form để đổi mật khẩu
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IPasswordChangePayload } from '../types/profile.types';

interface ChangePasswordFormProps {
  isLoading?: boolean;
  onSubmit: (data: IPasswordChangePayload) => Promise<boolean>;
  onCancel?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }
    if (!newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    }
    if (newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data: IPasswordChangePayload = {
      currentPassword,
      newPassword,
    };

    const success = await onSubmit(data);
    if (success) {
      Alert.alert('Thành Công', 'Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onCancel?.();
    }
  };

  const PasswordInput = ({ label, value, onChangeText, field, error }: any) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            error && styles.inputError,
          ]}
          placeholder="Nhập mật khẩu"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPasswords[field]}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={() =>
            setShowPasswords(prev => ({
              ...prev,
              [field]: !prev[field],
            }))
          }
        >
          <Text style={styles.toggleText}>
            {showPasswords[field] ? 'Ẩn' : 'Hiện'}
          </Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <PasswordInput
        label="Mật Khẩu Hiện Tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        field="current"
        error={errors.currentPassword}
      />

      <PasswordInput
        label="Mật Khẩu Mới"
        value={newPassword}
        onChangeText={setNewPassword}
        field="new"
        error={errors.newPassword}
      />

      <PasswordInput
        label="Xác Nhận Mật Khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        field="confirm"
        error={errors.confirmPassword}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Đổi Mật Khẩu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
  },
  passwordInput: {
    borderWidth: 0,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  toggleText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#212121',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
