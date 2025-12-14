/**
 * ProfileHeader Component
 * Hiển thị avatar, fullName, role
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { IUserProfile } from '../types/profile.types';

interface ProfileHeaderProps {
  profile: IUserProfile | null;
  loading?: boolean;
  onEditPress?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  loading = false,
  onEditPress,
}) => {
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'system-admin': 'Quản Lý Hệ Thống',
      'branch-manager': 'Quản Lý Chi Nhánh',
      employee: 'Nhân Viên',
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không thể tải thông tin profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {profile.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.fullName}>{profile.fullName}</Text>
      <Text style={styles.role}>{getRoleLabel(profile.role)}</Text>
      <Text style={styles.username}>@{profile.username}</Text>

      {onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Chỉnh Sửa Hồ Sơ</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  username: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    marginTop: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
});
