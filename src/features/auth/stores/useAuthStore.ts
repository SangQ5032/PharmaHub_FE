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
    try {
      // Lưu vào Zustand store trước
      set({ accessToken });

      // Lưu vào AsyncStorage (nếu chưa có)
      const existingToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS);

      // Thử lưu với error handling chi tiết
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS, accessToken);

        // Đợi một chút để đảm bảo commit
        await new Promise(resolve => setTimeout(resolve, 50));

        // Verify ngay sau khi lưu
        const verifyToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS);

        if (!verifyToken || verifyToken !== accessToken) {
          console.error('❌ LỖI: Token không khớp sau khi lưu!');
          // Thử lưu lại
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS, accessToken);
          await new Promise(resolve => setTimeout(resolve, 100));
          const retryVerify = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS);
        }
      } catch (storageError: any) {
        console.error('❌ Lỗi khi lưu vào AsyncStorage:', {
          message: storageError?.message,
          name: storageError?.name,
          code: storageError?.code,
          stack: storageError?.stack,
        });
        throw storageError;
      }

      if (refreshToken) {
        set({ refreshToken });
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH, refreshToken);
      }
    } catch (error) {
      console.error('❌ Lỗi trong setToken:', error);
      throw error;
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
