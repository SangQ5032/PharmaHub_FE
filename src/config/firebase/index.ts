// src/config/firebase/index.ts
import auth from '@react-native-firebase/auth';

// Firebase đã được tự động khởi tạo với google-services.json (Android)
// và GoogleService-Info.plist (iOS)
// Chúng ta chỉ cần export các service cần dùng
export { auth };

export default {
  auth,
};
