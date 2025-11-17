import apiClient from '@shared/services/api';
import {
  AttendanceResponse,
  CheckinBody,
  CheckoutBody,
} from '@features/checkin-checkout/types/types';

export const attendanceApi = {
  /**
   * Checkin (Chấm công vào)
   */
  checkin: async (body: CheckinBody = {}): Promise<AttendanceResponse> => {
    const res = await apiClient.post('/attendance/checkin', body);
    return res.data;
  },

  /**
   * Checkout (Chấm công ra)
   */
  checkout: async (body: CheckoutBody = {}): Promise<AttendanceResponse> => {
    const res = await apiClient.post('/attendance/checkout', body);
    return res.data;
  },

  /**
   * Lấy lịch sử chấm công của user hiện tại
   */
  getMyAttendance: async (): Promise<AttendanceResponse> => {
    const res = await apiClient.get('/attendance/my-attendance');
    return res.data;
  },
};
