import apiClient from '@shared/services/api';
import {
  WorkScheduleResponse,
  CreateWorkScheduleBody,
} from '@features/work-schdule/types/types';

export const workScheduleApi = {
  /**
   * Lấy tất cả lịch làm việc
   */
  getAll: async (): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get('/work-schedules');
    return res.data;
  },

  /**
   * Lấy lịch làm việc của user hiện tại (theo token)
   */
  getMySchedule: async (): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get('/work-schedules/my-schedule');
    return res.data;
  },

  /**
   * Tạo lịch làm việc mới
   */
  create: async (
    body: CreateWorkScheduleBody,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.post('/work-schedules', body);
    return res.data;
  },
};
