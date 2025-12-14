/**
 * ProfileInfo Component
 * Hiển thị email, phone, address, branch info
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IUserProfile } from '../types/profile.types';

interface ProfileInfoProps {
  profile: IUserProfile | null;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  if (!profile) return null;

  const infoItems = [
    { label: 'Email', value: profile.email },
    { label: 'Số Điện Thoại', value: profile.phone },
    profile.address && { label: 'Địa Chỉ', value: profile.address },
    profile.branchName && { label: 'Chi Nhánh', value: profile.branchName },
    profile.position && { label: 'Chức Vụ', value: profile.position },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>
      {infoItems.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <Text style={styles.label}>{item?.label}</Text>
          <Text style={styles.value}>{item?.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
