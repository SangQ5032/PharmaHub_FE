import type { WorkHistory, Medicine } from '../types';

/**
 * Employee status types
 */
export type EmployeeStatus = 'active' | 'inactive' | 'blocked';

/**
 * Get color for employee status
 */
export const getEmployeeStatusColor = (status: EmployeeStatus): string => {
  switch (status) {
    case 'active':
      return '#4CAF50';
    case 'inactive':
      return '#FFA726';
    case 'blocked':
      return '#EF5350';
    default:
      return '#999';
  }
};

/**
 * Get display text for employee status
 */
export const getEmployeeStatusText = (status: EmployeeStatus): string => {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Tạm khóa';
    case 'blocked':
      return 'Đã khóa';
    default:
      return status;
  }
};

/**
 * Get color for work history status
 */
export const getWorkStatusColor = (status: WorkHistory['status']): string => {
  switch (status) {
    case 'on-time':
      return '#4CAF50';
    case 'late':
      return '#FFA726';
    case 'absent':
      return '#EF5350';
    case 'working':
      return '#2196F3';
    default:
      return '#999';
  }
};

/**
 * Get display text for work history status
 */
export const getWorkStatusText = (status: WorkHistory['status']): string => {
  switch (status) {
    case 'on-time':
      return 'Đúng giờ';
    case 'late':
      return 'Muộn';
    case 'absent':
      return 'Vắng';
    case 'working':
      return 'Đang làm';
    default:
      return 'Không xác định';
  }
};

/**
 * Get display text for work shift
 */
export const getShiftText = (shift: WorkHistory['shift']): string => {
  switch (shift) {
    case 'morning':
      return 'Ca sáng';
    case 'afternoon':
      return 'Ca chiều';
    case 'evening':
      return 'Ca tối';
    default:
      return '';
  }
};

/**
 * Get display text for medicine status
 */
export const getMedicineStatusText = (status: Medicine['status']): string => {
  switch (status) {
    case 'in-stock':
      return 'Còn hàng';
    case 'low-stock':
      return 'Sắp hết';
    case 'out-of-stock':
      return 'Hết hàng';
    case 'expired':
      return 'Hết hạn';
    default:
      return 'Không xác định';
  }
};

/**
 * Get color for medicine stock status
 */
export const getMedicineStatusColor = (status: Medicine['status']): string => {
  switch (status) {
    case 'in-stock':
      return '#4CAF50';
    case 'low-stock':
      return '#FFA726';
    case 'out-of-stock':
      return '#EF5350';
    case 'expired':
      return '#9E9E9E';
    default:
      return '#999';
  }
};
