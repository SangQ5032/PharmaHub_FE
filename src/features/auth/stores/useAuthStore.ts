/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '../types/types';

const STORAGE_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
  USER: 'user',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  /**
   * Lưu token và user vào store + AsyncStorage
   */
  setToken: async (accessToken, refreshToken) => {
    set({ accessToken });
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS, accessToken);
    if (refreshToken) {
      set({ refreshToken });
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH, refreshToken);
    }
  },

  /**
   * Lưu thông tin user
   */
  setUser: user => {
    set({ user });
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Khôi phục token và user khi mở lại app
   */
  restoreSession: async () => {
    try {
      const [accessToken, refreshToken, userString] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (accessToken) set({ accessToken });
      if (refreshToken) set({ refreshToken });
      if (userString) set({ user: JSON.parse(userString) });
    } catch (error) {
      console.error('❌ restoreSession failed:', error);
    }
  },

  /**
   * Xóa toàn bộ session
   */
  logout: async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS,
      STORAGE_KEYS.REFRESH,
      STORAGE_KEYS.USER,
    ]);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
