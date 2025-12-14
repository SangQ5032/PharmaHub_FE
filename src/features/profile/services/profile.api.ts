/**
 * Profile API Service
 * Gọi các endpoint profile từ backend
 */

import { apiClient } from '@shared/services/api';
import {
  IUserProfile,
  IProfileSummary,
  IProfileUpdatePayload,
  IPasswordChangePayload,
  IAvatarUploadResponse,
} from '../types/profile.types';

const PROFILE_BASE_URL = '/profile';

export const profileApi = {
  /**
   * GET /api/profile/me
   * Lấy đầy đủ thông tin profile của người dùng hiện tại
   */
  getMe: async (): Promise<IUserProfile> => {
    const response = await apiClient.get<IUserProfile>(
      `${PROFILE_BASE_URL}/me`,
    );
    return response.data;
  },

  /**
   * GET /api/profile/summary
   * Lấy thông tin tóm tắt profile (dùng cho Bottom Tabs)
   */
  getSummary: async (): Promise<IProfileSummary> => {
    const response = await apiClient.get<IProfileSummary>(
      `${PROFILE_BASE_URL}/summary`,
    );
    return response.data;
  },

  /**
   * PUT /api/profile
   * Cập nhật thông tin cá nhân
   */
  updateProfile: async (data: IProfileUpdatePayload): Promise<IUserProfile> => {
    const response = await apiClient.put<IUserProfile>(
      `${PROFILE_BASE_URL}`,
      data,
    );
    return response.data;
  },

  /**
   * PATCH /api/profile/password
   * Đổi mật khẩu
   */
  changePassword: async (data: IPasswordChangePayload): Promise<void> => {
    await apiClient.patch(`${PROFILE_BASE_URL}/password`, data);
  },

  /**
   * PATCH /api/profile/avatar
   * Upload/đổi avatar
   */
  uploadAvatar: async (file: FormData): Promise<IAvatarUploadResponse> => {
    const response = await apiClient.patch<IAvatarUploadResponse>(
      `${PROFILE_BASE_URL}/avatar`,
      file,
    );
    return response.data;
  },

  /**
   * DELETE /api/profile (Optional)
   * Vô hiệu hóa tài khoản
   */
  deleteProfile: async (): Promise<void> => {
    await apiClient.delete(`${PROFILE_BASE_URL}`);
  },
};
