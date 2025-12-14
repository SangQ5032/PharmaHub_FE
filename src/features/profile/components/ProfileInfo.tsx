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

const placeholder = 'Chưa cập nhật';

const formatPhone = (phone?: string) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10)
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  if (digits.length === 11)
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return phone;
};

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  if (!profile) return null;

  const infoItems = [
    { label: 'Email', value: profile.email || placeholder },
    {
      label: 'Số Điện Thoại',
      value: formatPhone(profile.phone) || placeholder,
    },
    { label: 'Địa Chỉ', value: profile.address || placeholder },
    ...(profile.branchName
      ? [{ label: 'Chi Nhánh', value: profile.branchName }]
      : []),
    ...(profile.position
      ? [{ label: 'Chức Vụ', value: profile.position }]
      : []),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>
      {infoItems.map((item, index) => (
        <View key={index} style={styles.infoRow}>
          <Text style={styles.label}>{item.label}</Text>
          <Text
            style={[
              styles.value,
              item.value === placeholder && styles.valuePlaceholder,
            ]}
            numberOfLines={2}
          >
            {item.value}
          </Text>
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
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginLeft: 12,
  },
  valuePlaceholder: {
    color: '#9E9E9E',
    fontWeight: '400',
  },
});
