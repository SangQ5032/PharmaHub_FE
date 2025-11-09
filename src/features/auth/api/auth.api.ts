import apiClient from '@shared/services/api';
import {
  LoginBody,
  LoginUsernameBody,
  LoginFirebaseBody,
  LoginData,
  SendOTPBody,
  SendOTPResponse,
  VerifyOTPBody,
  VerifyOTPResponse,
  VerifyFirebaseTokenBody,
  VerifyFirebaseTokenResponse,
} from '@features/auth/types/types';

export const authApi = {
  /**
   * Đăng nhập với username/password
   * Endpoint: /auth/login-username
   * Response format: { success: true, message: "...", accessToken: "...", id: "...", username: "...", ... }
   */
  loginUsername: async (body: LoginUsernameBody): Promise<LoginData> => {
    const res = await apiClient.post('/auth/login-username', body);

    // Response format: { success: true, message: "...", data: { accessToken, user } }
    if (res.data.success) {
      let loginData: LoginData;

      // Nếu có data wrapper (format chuẩn)
      if (res.data.data) {
        loginData = res.data.data;
      }
      // Nếu response trực tiếp có accessToken ở top level (fallback)
      else if (res.data.accessToken) {
        loginData = {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          user: {
            id: res.data.id,
            username: res.data.username,
            phone: res.data.phone,
            role: res.data.role,
            branch_id: res.data.branch_id,
          },
        };
      } else {
        throw new Error('Không tìm thấy accessToken trong response');
      }

      // Verify loginData trước khi return
      if (!loginData || !loginData.accessToken) {
        throw new Error('loginData không có accessToken');
      }

      // Verify token là string và không rỗng
      if (
        typeof loginData.accessToken !== 'string' ||
        loginData.accessToken.trim() === ''
      ) {
        throw new Error('accessToken không hợp lệ');
      }

      return loginData;
    }
    throw new Error(res.data.message || 'Đăng nhập thất bại');
  },

  /**
   * Đăng nhập với Firebase ID Token
   * Endpoint: /auth/login
   * Response format: { success: true, message: "...", accessToken: "...", id: "...", username: "...", ... }
   */
  loginFirebase: async (body: LoginFirebaseBody): Promise<LoginData> => {
    const res = await apiClient.post('/auth/login', body);
    // Response có thể có 2 format:
    // 1. { success: true, data: { accessToken, user } }
    // 2. { success: true, accessToken: "...", id: "...", username: "...", ... }
    if (res.data.success) {
      // Nếu có data wrapper
      if (res.data.data) {
        return res.data.data;
      }
      // Nếu response trực tiếp có accessToken ở top level
      if (res.data.accessToken) {
        return {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          user: {
            id: res.data.id,
            username: res.data.username,
            phone: res.data.phone,
            role: res.data.role,
            branch_id: res.data.branch_id,
          },
        };
      }
    }
    throw new Error(res.data.message || 'Đăng nhập thất bại');
  },

  /**
   * Backward compatibility - sử dụng loginUsername
   */
  login: async (body: LoginBody): Promise<LoginData> => {
    return authApi.loginUsername(body);
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
