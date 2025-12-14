/**
 * Profile API Service
 * Gọi các endpoint profile từ backend
 */

import { apiClient } from '@shared/services/api';
import { authApi } from '@features/auth/api/auth.api';
import {
  IUserProfile,
  IProfileSummary,
  IProfileUpdatePayload,
  IPasswordChangePayload,
  IAvatarUploadResponse,
} from '../types/profile.types';

const PROFILE_BASE_URL = '/profile';

// Normalize helpers
const normalizeRole = (
  role: any,
): 'system-admin' | 'branch-manager' | 'employee' => {
  const r = String(role || '')
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
  if (r.includes('system') && r.includes('admin')) return 'system-admin';
  if (r.includes('branch') && r.includes('manager')) return 'branch-manager';
  return 'employee';
};

const pickEntity = (payload: any) => {
  if (!payload) return {};
  // Common wrappers from BE
  if (payload.data?.data) return payload.data.data;
  if (payload.data?.user) return payload.data.user;
  if (payload.data?.profile) return payload.data.profile;
  if (payload.result?.user) return payload.result.user;
  if (payload.result?.profile) return payload.result.profile;
  if (payload.payload?.user) return payload.payload.user;
  if (payload.payload?.profile) return payload.payload.profile;
  if (payload.userProfile) return payload.userProfile;
  if (payload.user) return payload.user;
  if (payload.profile) return payload.profile;
  if (payload.data) return payload.data;
  return payload;
};

export const normalizeProfile = (rawAny: any): IUserProfile => {
  const raw = pickEntity(rawAny);
  const fullName = raw?.fullName ?? raw?.name ?? '';
  const username = raw?.username ?? raw?.phone ?? raw?.email ?? '';
  const email = raw?.email ?? raw?.contact?.email ?? '';
  const phone = raw?.phone ?? raw?.contact?.phone ?? '';

  return {
    id: raw?.id ?? raw?._id ?? '',
    username,
    fullName: fullName || 'Người dùng',
    email,
    phone,
    role: normalizeRole(raw?.role),
    avatarUrl: raw?.avatarUrl ?? raw?.avatar ?? undefined,
    address: raw?.address ?? raw?.contact?.address ?? undefined,
    branchId: raw?.branchId ?? raw?.branch_id ?? raw?.branch?.id ?? undefined,
    branchName: raw?.branchName ?? raw?.branch?.name ?? undefined,
    position: raw?.position ?? raw?.title ?? undefined,
    createdAt: raw?.createdAt ?? raw?.created_at ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? new Date().toISOString(),
  };
};

const hasBasicData = (p: IUserProfile) => {
  return Boolean(
    (p.fullName && p.fullName !== 'Người dùng') ||
      p.email ||
      p.phone ||
      p.username,
  );
};

const mergeProfile = (
  primary: IUserProfile,
  fallback: IUserProfile,
): IUserProfile => {
  return {
    ...fallback,
    ...primary,
    // strings: if primary empty, take fallback
    fullName:
      primary.fullName && primary.fullName !== 'Người dùng'
        ? primary.fullName
        : fallback.fullName,
    email: primary.email || fallback.email,
    phone: primary.phone || fallback.phone,
    avatarUrl: primary.avatarUrl || fallback.avatarUrl,
    address: primary.address || fallback.address,
    branchId: primary.branchId || fallback.branchId,
    branchName: primary.branchName || fallback.branchName,
    position: primary.position || fallback.position,
  };
};

export const profileApi = {
  /**
   * GET /api/profile/me
   * Lấy đầy đủ thông tin profile của người dùng hiện tại
   */
  getMe: async (): Promise<IUserProfile> => {
    const response = await apiClient.get<any>(`${PROFILE_BASE_URL}/me`);
    let me = normalizeProfile(response.data);

    if (!hasBasicData(me)) {
      try {
        const authMe = await authApi.profile();
        const normalizedAuth = normalizeProfile(authMe);
        me = mergeProfile(me, normalizedAuth);
      } catch (_e) {
        // ignore fallback error
      }
    }

    return me;
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
    const response = await apiClient.put<any>(`${PROFILE_BASE_URL}`, data);
    return normalizeProfile(response.data);
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
