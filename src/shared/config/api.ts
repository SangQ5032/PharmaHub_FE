import { Platform } from 'react-native';

// Configuration for API Base URL
// Lưu ý: Trên Android emulator, dùng 10.0.2.2 thay vì localhost
// Trên iOS simulator, có thể dùng localhost
// Trên thiết bị thật, dùng IP thực tế của máy tính (ví dụ: 192.168.1.100:8080)

export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

export default API_BASE_URL;
