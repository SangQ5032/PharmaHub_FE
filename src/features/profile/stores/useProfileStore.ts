/**
 * Profile Zustand Store
 * Quản lý state profile của người dùng
 */

import { create } from 'zustand';
import { profileApi, normalizeProfile } from '../services/profile.api';
import {
  IUserProfile,
  IProfileSummary,
  IProfileUpdatePayload,
  IPasswordChangePayload,
  IProfileState,
} from '../types/profile.types';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

export const useProfileStore = create<IProfileState>((set, get) => ({
  profile: null,
  summary: null,
  loading: false,
  error: null,

  /**
   * Fetch profile đầy đủ
   */
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      // Seed từ auth store (nếu có) để tránh UI trống
      const authUser = useAuthStore.getState().user;
      const current = get().profile;
      const seed = authUser ? normalizeProfile(authUser) : null;
      if (seed && !current) {
        set({ profile: seed });
      }

      const apiProfile = await profileApi.getMe();

      // Merge dữ liệu API với seed (ưu tiên API)
      const merged = seed
        ? {
            ...seed,
            ...apiProfile,
            fullName:
              apiProfile.fullName && apiProfile.fullName !== 'Người dùng'
                ? apiProfile.fullName
                : seed.fullName,
            email: apiProfile.email || seed.email,
            phone: apiProfile.phone || seed.phone,
            avatarUrl: apiProfile.avatarUrl || seed.avatarUrl,
            address: apiProfile.address || seed.address,
            branchId: apiProfile.branchId || seed.branchId,
            branchName: apiProfile.branchName || seed.branchName,
            position: apiProfile.position || seed.position,
          }
        : apiProfile;

      set({ profile: merged, loading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Lỗi tải profile';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * Cập nhật thông tin profile
   */
  updateProfile: async (data: IProfileUpdatePayload) => {
    set({ loading: true, error: null });
    try {
      const updatedProfile = await profileApi.updateProfile(data);
      set({ profile: updatedProfile, loading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Lỗi cập nhật profile';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * Đổi mật khẩu
   */
  changePassword: async (data: IPasswordChangePayload) => {
    set({ loading: true, error: null });
    try {
      await profileApi.changePassword(data);
      set({ loading: false });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Lỗi đổi mật khẩu';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: FormData) => {
    set({ loading: true, error: null });
    try {
      const response = await profileApi.uploadAvatar(file);
      // Cập nhật profile với avatar mới
      const currentProfile = get().profile;
      if (currentProfile) {
        set({
          profile: { ...currentProfile, avatarUrl: response.avatarUrl },
          loading: false,
        });
      }
      return response.avatarUrl;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Lỗi upload avatar';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    set({ profile: null, summary: null, error: null });
    await useAuthStore.getState().logout();
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));
