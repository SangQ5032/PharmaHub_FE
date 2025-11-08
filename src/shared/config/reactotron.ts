// src/shared/config/reactotron.ts
import Reactotron from 'reactotron-react-native';
import { Platform } from 'react-native';

// Khai báo type cho __DEV__ (React Native tự động định nghĩa biến này)
declare const __DEV__: boolean;

// Xác định host dựa trên platform
// Android emulator cần dùng '10.0.2.2' để kết nối với localhost
// iOS simulator và thiết bị thật dùng 'localhost' hoặc IP của máy
const getHost = () => {
  if (Platform.OS === 'android') {
    // Trên Android emulator, dùng '10.0.2.2' để kết nối với localhost của máy
    // Nếu chạy trên thiết bị thật, cần dùng IP thực tế của máy (VD: '192.168.1.100')
    return __DEV__ ? '10.0.2.2' : 'localhost';
  }
  // iOS simulator hoặc thiết bị iOS
  return 'localhost';
};

// Chỉ khởi tạo Reactotron trong môi trường development
let reactotron: any = null;

if (__DEV__) {
  try {
    reactotron = Reactotron.configure({
      name: 'PharmaHub App',
      host: getHost(),
    })
      .useReactNative({
        asyncStorage: {
          ignore: ['secret'],
        },
        networking: {
          ignoreUrls: /symbolicate|logs/,
        },
        editor: false,
        errors: { veto: () => false },
        overlay: false,
      })
      .connect();

    // Clear timeline mỗi khi reload
    reactotron.clear?.();

    console.log('✅ Reactotron đã được khởi tạo');
  } catch (error) {
    console.warn('⚠️ Lỗi khởi tạo Reactotron:', error);
  }
}

// Khai báo global type cho console.tron
declare global {
  interface Console {
    tron: typeof reactotron;
  }
}

// Gán reactotron vào console.tron để sử dụng
if (__DEV__ && reactotron) {
  console.tron = reactotron;
} else {
  // Fallback: tạo mock object để tránh lỗi khi gọi console.tron
  console.tron = {
    log: (...args: any[]) => console.log(...args),
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
    display: () => {},
    image: () => console.tron,
    clear: () => {},
  } as any;
}

export { reactotron };
