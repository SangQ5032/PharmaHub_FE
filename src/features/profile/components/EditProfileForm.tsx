/**
 * EditProfileForm Component
 * Form để chỉnh sửa thông tin profile
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
import { IUserProfile, IProfileUpdatePayload } from '../types/profile.types';

interface EditProfileFormProps {
  profile: IUserProfile | null;
  isLoading?: boolean;
  onSubmit: (data: IProfileUpdatePayload) => Promise<boolean>;
  onCancel?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  profile,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Tên không được để trống';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    }
    if (!/^[0-9]{10,11}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data: IProfileUpdatePayload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
    };

    const success = await onSubmit(data);
    if (success) {
      Alert.alert('Thành Công', 'Cập nhật thông tin thành công');
      onCancel?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tên Đầy Đủ</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Nhập tên đầy đủ"
          value={fullName}
          onChangeText={setFullName}
          editable={!isLoading}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Số Điện Thoại</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Địa Chỉ</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />
      </View>

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
            <Text style={styles.submitButtonText}>Lưu Thay Đổi</Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 10,
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
