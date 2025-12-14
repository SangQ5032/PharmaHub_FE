/**
 * ProfileScreen
 * Màn hình hiển thị thông tin profile đầy đủ
 */

import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../hooks/useProfile';
import { useProfileStore } from '../stores/useProfileStore';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfo } from '../components/ProfileInfo';
import { ProfileActions } from '../components/ProfileActions';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, loading, error, refetch } = useProfile();
  const { logout } = useProfileStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleEditPress = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleChangePasswordPress = useCallback(() => {
    navigation.navigate('ChangePassword');
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      // Navigation will be handled by auth state change
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  }, [logout]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Error refreshing profile:', err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ProfileHeader
        profile={profile}
        loading={loading}
        onEditPress={handleEditPress}
      />

      <ProfileInfo profile={profile} />

      <ProfileActions
        onEditPress={handleEditPress}
        onChangePasswordPress={handleChangePasswordPress}
        onLogoutPress={handleLogout}
        isLoading={loading}
      />

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  footer: {
    height: 20,
  },
});
