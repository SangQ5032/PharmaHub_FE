import apiClient from '@shared/services/api';
import {
  AttendanceResponse,
  CheckinBody,
  CheckoutBody,
} from '@features/checkin-checkout/types/types';

export const attendanceApi = {
  /**
   * Checkin (Chấm công vào) - Yêu cầu latitude và longitude
   * API: POST /api/attendance/checkin
   * Body: { latitude, longitude }
   */
  checkin: async (body: CheckinBody): Promise<AttendanceResponse> => {
    if (!body.latitude || !body.longitude) {
      throw new Error('Vui lòng cấp quyền truy cập vị trí');
    }
    const res = await apiClient.post('/attendance/checkin', body);
    return res.data;
  },

  /**
   * Checkout (Chấm công ra)
   * API: POST /api/attendance/checkout
   * Body: {}
   */
  checkout: async (body: CheckoutBody = {}): Promise<AttendanceResponse> => {
    const res = await apiClient.post('/attendance/checkout', body);
    return res.data;
  },

  /**
   * Lấy lịch sử chấm công của user hiện tại
   * API: GET /api/attendance/my-attendance
   */
  getMyAttendance: async (): Promise<AttendanceResponse> => {
    const res = await apiClient.get('/attendance/my-attendance');
    return res.data;
  },
};
