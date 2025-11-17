// src/services/http.ts
// Client Axios dùng chung cho toàn bộ app FE (Expo/React Native).
// ⚠️ Thay đổi BASE_URL cho phù hợp môi trường của bạn.

import axios, { AxiosInstance, AxiosError } from 'axios';

// Android emulator: http://10.0.2.2:5000/api
// iOS simulator:   http://localhost:5000/api
// Thiết bị thật:   http://<IP-PC-cùng-WiFi>:5000/api
const BASE_URL: string =
  ((process.env as any)?.EXPO_PUBLIC_API_URL as string | undefined) ??
  'http://10.0.2.2:5000/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  res => res,
  (err: AxiosError<any>) => {
    const msg =
      (err.response?.data as any)?.message ||
      err.message ||
      'Lỗi không xác định';
    return Promise.reject(new Error(msg));
  },
);
