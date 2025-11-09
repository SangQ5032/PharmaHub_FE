import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginBody, LoginUsernameBody } from '@features/auth/types/types';
import { authApi } from '@features/auth/api/auth.api';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginBody | LoginUsernameBody) =>
      authApi.loginUsername(body),
    onSuccess: async data => {
      if (data.accessToken) {
        try {
          await AsyncStorage.setItem('accessToken', data.accessToken);
          await useAuthStore
            .getState()
            .setToken(data.accessToken, data.refreshToken);
        } catch (error) {
          console.error('❌ Lỗi khi lưu token:', error);
          console.error('❌ Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          throw error; // Re-throw để onError được gọi
        }
      } else {
        console.error('❌ Lỗi: Không có accessToken trong response');
        throw new Error('Không có accessToken trong response');
      }

      // Lưu thông tin user
      if (data.user) {
        try {
          useAuthStore.getState().setUser(data.user);
        } catch (error) {
          console.error('❌ Lỗi khi lưu user info:', error);
        }
      }
    },
    onError: error => {
      console.error('❌ Login error:', error);
    },
  });
}
