import { Alert, PermissionsAndroid, Platform } from 'react-native';

/**
 * Hook để xin quyền truy cập vị trí từ người dùng
 * Hỗ trợ cả Android và iOS
 */
export const useLocationPermission = () => {
  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Yêu cầu quyền truy cập vị trí',
            message:
              'Ứng dụng cần quyền truy cập vị trí để xác định vị trí chính xác',
            buttonNeutral: 'Hỏi sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Cho phép',
          },
        );
        return permission === PermissionsAndroid.RESULTS.GRANTED;
      }

      // iOS: Quyền được yêu cầu tự động thông qua Info.plist
      // Người dùng sẽ thấy dialog từ hệ thống lần đầu gọi Geolocation.getCurrentPosition
      return true;
    } catch (error: any) {
      Alert.alert('Lỗi', 'Lỗi khi yêu cầu quyền: ' + error.message);
      return false;
    }
  };

  const checkPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return result;
      }
      // iOS không cần check
      return true;
    } catch (error: any) {
      Alert.alert('Lỗi', 'Lỗi khi kiểm tra quyền: ' + error.message);
      return false;
    }
  };

  return {
    requestPermission,
    checkPermission,
  };
};
