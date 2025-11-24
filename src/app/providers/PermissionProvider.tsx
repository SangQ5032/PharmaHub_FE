import React, { useEffect } from 'react';
import { useLocationPermission } from '@shared/hooks/useLocationPermission';

/**
 * PermissionProvider - Quản lý các quyền cần thiết cho ứng dụng
 * Lưu ý: Quyền Location chỉ được yêu cầu khi người dùng thực sự cần dùng
 */
export const PermissionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { checkPermission } = useLocationPermission();

  useEffect(() => {
    // Kiểm tra quyền vị trí khi ứng dụng khởi động (optional)
    // Đây chỉ là kiểm tra, không yêu cầu quyền
    const checkPermissions = async () => {
      try {
        await checkPermission();
        // Log để debug
        // console.log('Location permission status checked');
      } catch (error) {
        // Silent error - không cần alert
      }
    };

    checkPermissions();
  }, [checkPermission]);

  return <>{children}</>;
};
