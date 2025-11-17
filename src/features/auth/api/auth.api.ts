import apiClient from '@shared/services/api';
import {
  LoginFirebaseBody,
  VerifyFirebaseTokenResponse,
} from '@features/auth/types/types';

export const authApi = {
  /**
   * Xác thực idToken từ Firebase và lấy accessToken, refreshToken từ server
   * Endpoint: /auth/check-token
   * Response format: { success: true, data: { accessToken, refreshToken, user } }
   */
  verifyFirebaseToken: async (
    body: LoginFirebaseBody,
  ): Promise<VerifyFirebaseTokenResponse> => {
    const res = await apiClient.post('/auth/check-token', body);
    return res.data;
  },

  /**
   * Lấy thông tin profile của user hiện tại
   */
  profile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },
};
