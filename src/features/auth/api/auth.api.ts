import apiClient from '@shared/services/api';
import {
  LoginBody,
  LoginData,
  SendOTPBody,
  SendOTPResponse,
  VerifyOTPBody,
  VerifyOTPResponse,
  VerifyFirebaseTokenBody,
  VerifyFirebaseTokenResponse,
} from '@features/auth/types/types';

export const authApi = {
  login: async (body: LoginBody): Promise<LoginData> => {
    const res = await apiClient.post('/auth/login', body);
    // res.data = { code, status, data: {...} }
    return res.data.data; // ✅ trả thẳng object sạch
  },

  profile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data; // ✅ cũng clean luôn
  },

  /**
   * Gửi mã OTP đến số điện thoại
   */
  sendOTP: async (body: SendOTPBody): Promise<SendOTPResponse> => {
    const res = await apiClient.post('/auth/send-otp', body);
    // Giả định response format: { code, status, data: { success, message, sessionId } }
    console.log('Send OTP Response:', res.data);
    return res.data; // ✅ Trả về toàn bộ response object vì API đã có success ở top level
  },

  /**
   * Xác thực mã OTP
   */
  verifyOTP: async (body: VerifyOTPBody): Promise<VerifyOTPResponse> => {
    const res = await apiClient.post('/auth/verify-otp', body);
    // Giả định response format: { code, status, data: { success, accessToken, refreshToken, user } }
    return res.data.data || res.data;
  },

  /**
   * Xác thực idToken từ Firebase và lấy accessToken, refreshToken từ server
   */
  verifyFirebaseToken: async (
    body: VerifyFirebaseTokenBody,
  ): Promise<VerifyFirebaseTokenResponse> => {
    const res = await apiClient.post('/auth/login', body);
    // Giả định response format: { code, status, data: { success, accessToken, refreshToken, user } }
    return res.data;
  },
};
