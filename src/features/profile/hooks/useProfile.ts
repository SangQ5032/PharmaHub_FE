/**
 * useProfile Hook
 * Custom hook để fetch và quản lý profile data
 */

import { useEffect, useState } from 'react';
import { useProfileStore } from '../stores/useProfileStore';
import { IUserProfile } from '../types/profile.types';

export const useProfile = () => {
  const { profile, loading, error, fetchProfile } = useProfileStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initProfile = async () => {
      if (!isInitialized && !profile) {
        try {
          await fetchProfile();
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
        setIsInitialized(true);
      }
    };

    initProfile();
  }, [isInitialized, profile, fetchProfile]);

  const refetch = async () => {
    try {
      await fetchProfile();
    } catch (err) {
      console.error('Error refetching profile:', err);
    }
  };

  return {
    profile,
    loading,
    error,
    refetch,
    isInitialized,
  };
};
