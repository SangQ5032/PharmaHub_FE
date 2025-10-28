import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-server-domain.com/api'; // 👈 đổi sang domain backend của bạn

// Tạo instance axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ====== REQUEST INTERCEPTOR ======
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ====== RESPONSE INTERCEPTOR ======
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token hết hạn → có thể logout hoặc refresh
        Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại.');
        await AsyncStorage.removeItem('accessToken');
      } else if (status >= 500) {
        Alert.alert('Lỗi máy chủ', 'Vui lòng thử lại sau.');
      }
    } else if (error.request) {
      Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ.');
    } else {
      Alert.alert('Lỗi không xác định', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
