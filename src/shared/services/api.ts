import axios, { AxiosError, AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu ý: Trên Android emulator, dùng 10.0.2.2 thay vì localhost
// Trên iOS simulator, có thể dùng localhost
// Trên thiết bị thật, dùng IP thực tế của máy tính (ví dụ: 192.168.1.100:5000)
// const API_URL =
//   Platform.OS === 'android'
//     ? 'http://192.168.50.115:5000/api' // Android emulator
//     : 'http://192.168.50.115:5000/api'; // iOS simulator hoặc thiết bị thật
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

// Tạo instance axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    // KHÔNG set Content-Type mặc định ở đây
    // Sẽ được set động trong interceptor tùy vào loại data
  },
});

// ====== REQUEST INTERCEPTOR ======
api.interceptors.request.use(
  async config => {
    try {
      // Xử lý FormData đặc biệt cho React Native
      if (config.data instanceof FormData) {
        // Xóa Content-Type để browser tự động set với boundary
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
        // Giữ lại Accept header
        config.headers.Accept = 'application/json';
      } else {
        // Với JSON data, set Content-Type
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }
      }

      // Thử lấy token từ AsyncStorage trước
      let token = await AsyncStorage.getItem('accessToken');

      // Nếu không có trong AsyncStorage, thử lấy từ Zustand store
      if (!token) {
        try {
          // Dynamic import để tránh circular dependency
          const { useAuthStore } = await import(
            '@features/auth/stores/useAuthStore'
          );
          const storeToken = useAuthStore.getState().accessToken;
          if (storeToken) {
            token = storeToken;
            // Đồng bộ lại vào AsyncStorage
            await AsyncStorage.setItem('accessToken', storeToken);
          }
        } catch (storeError) {
          // XÓA TOÀN BỘ LOG DEBUG (chỉ giữ lại return config, return response, throw error)
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // XÓA TOÀN BỘ LOG DEBUG (chỉ giữ lại return config, return response, throw error)
      }
    } catch (error) {
      // XÓA TOÀN BỘ LOG DEBUG (chỉ giữ lại return config, return response, throw error)
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ====== RESPONSE INTERCEPTOR ======
api.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    // XÓA TOÀN BỘ LOG DEBUG (chỉ giữ lại return config, return response, throw error)

    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      // Xóa token khỏi AsyncStorage
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

      // Có thể thêm logic logout ở đây nếu cần
      // import { useAuthStore } from '@features/auth/stores/useAuthStore';
      // useAuthStore.getState().logout();

      // Không hiển thị alert ở đây vì có thể gây spam
      // Các màn hình sẽ tự xử lý lỗi 401
    }

    return Promise.reject(error);
  },
);

export { api as apiClient };
export default api;
