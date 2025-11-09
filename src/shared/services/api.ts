import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu ý: Trên Android emulator, dùng 10.0.2.2 thay vì localhost
// Trên iOS simulator, có thể dùng localhost
// Trên thiết bị thật, dùng IP thực tế của máy tính (ví dụ: 192.168.1.100:5000)
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api' // Android emulator
    : 'http://localhost:5000/api'; // iOS simulator hoặc thiết bị thật

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
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     if (error.response) {
//       const { status } = error.response;

//       if (status === 401) {
//         // Token hết hạn → có thể logout hoặc refresh
//         Alert.alert('Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại.');
//         await AsyncStorage.removeItem('accessToken');
//       } else if (status >= 500) {
//         Alert.alert('Lỗi máy chủ', 'Vui lòng thử lại sau.');
//       }
//     } else if (error.request) {
//       Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ.');
//     } else {
//       Alert.alert('Lỗi không xác định', error.message);
//     }
//     return Promise.reject(error);
//   },
// );
api.interceptors.response.use(
  response => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

export default api;
