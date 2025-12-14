/**
 * ChangePasswordScreen
 * Màn hình đổi mật khẩu
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
import { useProfileMutation } from '../hooks/useProfileMutation';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { IPasswordChangePayload } from '../types/profile.types';

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { changePassword, isLoading, error } = useProfileMutation();

  const handleSubmit = useCallback(
    async (data: IPasswordChangePayload) => {
      try {
        const success = await changePassword(data);
        if (success) {
          navigation.goBack();
        }
        return success;
      } catch (err) {
        Alert.alert('Lỗi', error || 'Không thể đổi mật khẩu');
        return false;
      }
    },
    [changePassword, error, navigation],
  );

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ChangePasswordForm
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
