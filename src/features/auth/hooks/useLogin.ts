import { useMutation } from '@tanstack/react-query';
import { LoginBody } from '@features/auth/types/types';
import { authApi } from '@features/auth/api/auth.api';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body),
    onSuccess: data => {
      useAuthStore.getState().setToken(data.accessToken);
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }
    },
  });
}
