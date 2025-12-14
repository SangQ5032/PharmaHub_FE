/**
 * Profile Types & Interfaces
 */

export interface IUserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'system-admin' | 'branch-manager' | 'employee';
  avatarUrl?: string;
  address?: string;
  branchId?: string;
  branchName?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileSummary {
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export interface IProfileUpdatePayload {
  fullName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface IPasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface IAvatarUploadResponse {
  avatarUrl: string;
}

export interface IProfileState {
  profile: IUserProfile | null;
  summary: IProfileSummary | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: IProfileUpdatePayload) => Promise<void>;
  changePassword: (data: IPasswordChangePayload) => Promise<void>;
  uploadAvatar: (file: File | FormData) => Promise<string>;
  logout: () => Promise<void>;
  clearError: () => void;
}
