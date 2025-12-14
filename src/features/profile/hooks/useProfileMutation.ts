/**
 * useProfileMutation Hook
 * Custom hook để handle mutations (update, change password, upload avatar)
 */

import { useState } from 'react';
import { useProfileStore } from '../stores/useProfileStore';
import {
  IProfileUpdatePayload,
  IPasswordChangePayload,
} from '../types/profile.types';

export const useProfileMutation = () => {
  const { updateProfile, changePassword, uploadAvatar, error, clearError } =
    useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleUpdateProfile = async (data: IProfileUpdatePayload) => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await updateProfile(data);
      return true;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Lỗi cập nhật profile';
      setLocalError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (data: IPasswordChangePayload) => {
    setIsLoading(true);
    setLocalError(null);
    try {
      await changePassword(data);
      return true;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Lỗi đổi mật khẩu';
      setLocalError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAvatar = async (file: FormData) => {
    setIsLoading(true);
    setLocalError(null);
    try {
      const avatarUrl = await uploadAvatar(file);
      return avatarUrl;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Lỗi upload avatar';
      setLocalError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error: localError || error,
    clearError,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,
    uploadAvatar: handleUploadAvatar,
  };
};
