/**
 * EditProfileScreen
 * Màn hình chỉnh sửa thông tin profile
 */

import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../hooks/useProfile';
import { useProfileMutation } from '../hooks/useProfileMutation';
import { EditProfileForm } from '../components/EditProfileForm';
import { IProfileUpdatePayload } from '../types/profile.types';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useProfile();
  const { updateProfile, isLoading, error } = useProfileMutation();

  const handleSubmit = useCallback(
    async (data: IProfileUpdatePayload) => {
      try {
        const success = await updateProfile(data);
        if (success) {
          navigation.goBack();
        }
        return success;
      } catch (err) {
        Alert.alert('Lỗi', error || 'Không thể cập nhật profile');
        return false;
      }
    },
    [updateProfile, error, navigation],
  );

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <EditProfileForm
          profile={profile}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
});
