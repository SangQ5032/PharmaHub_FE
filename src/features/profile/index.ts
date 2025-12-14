/**
 * Profile Feature - Barrel Export
 */

// Screens
export { ProfileScreen } from './screens/ProfileScreen';
export { EditProfileScreen } from './screens/EditProfileScreen';
export { ChangePasswordScreen } from './screens/ChangePasswordScreen';

// Components
export { ProfileHeader } from './components/ProfileHeader';
export { ProfileInfo } from './components/ProfileInfo';
export { ProfileActions } from './components/ProfileActions';
export { EditProfileForm } from './components/EditProfileForm';
export { ChangePasswordForm } from './components/ChangePasswordForm';
export { AvatarUpload } from './components/AvatarUpload';

// Services
export { profileApi } from './services/profile.api';

// Stores
export { useProfileStore } from './stores/useProfileStore';

// Hooks
export { useProfile } from './hooks/useProfile';
export { useProfileMutation } from './hooks/useProfileMutation';

// Types
export type {
  IUserProfile,
  IProfileSummary,
  IProfileUpdatePayload,
  IPasswordChangePayload,
  IAvatarUploadResponse,
  IProfileState,
} from './types/profile.types';
