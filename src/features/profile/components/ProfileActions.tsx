/**
 * ProfileActions Component
 * Buttons: Edit Profile, Change Password, Logout
 */

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface ProfileActionsProps {
  onEditPress?: () => void;
  onChangePasswordPress?: () => void;
  onLogoutPress?: () => void;
  isLoading?: boolean;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  onEditPress,
  onChangePasswordPress,
  onLogoutPress,
  isLoading = false,
}) => {
  const handleLogout = () => {
    Alert.alert('Đăng Xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', onPress: () => {}, style: 'cancel' },
      {
        text: 'Đăng Xuất',
        onPress: onLogoutPress,
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={onEditPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Chỉnh Sửa Hồ Sơ</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={onChangePasswordPress}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Đổi Mật Khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.dangerButton]}
        onPress={handleLogout}
        disabled={isLoading}
      >
        <Text style={styles.dangerButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryButtonText: {
    color: '#212121',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  dangerButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
});
