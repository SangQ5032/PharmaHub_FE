// src/features/warehouse/components/StatusBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusType =
  | 'normal'
  | 'low'
  | 'out_of_stock'
  | 'warning'
  | 'success'
  | 'error'
  | 'info';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'medium',
}) => {
  // Status configurations
  const statusConfig = {
    normal: {
      backgroundColor: '#4CAF50',
      label: label || 'Bình thường',
    },
    low: {
      backgroundColor: '#FF9800',
      label: label || 'Sắp hết',
    },
    out_of_stock: {
      backgroundColor: '#F44336',
      label: label || 'Hết hàng',
    },
    warning: {
      backgroundColor: '#FF9800',
      label: label || 'Cảnh báo',
    },
    success: {
      backgroundColor: '#4CAF50',
      label: label || 'Thành công',
    },
    error: {
      backgroundColor: '#F44336',
      label: label || 'Lỗi',
    },
    info: {
      backgroundColor: '#2196F3',
      label: label || 'Thông tin',
    },
  };

  // Size configurations
  const sizeConfig = {
    small: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 11,
      borderRadius: 8,
    },
    medium: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 12,
      borderRadius: 12,
    },
    large: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 14,
      borderRadius: 16,
    },
  };

  const config = statusConfig[status];
  const sizeStyle = sizeConfig[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          borderRadius: sizeStyle.borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
