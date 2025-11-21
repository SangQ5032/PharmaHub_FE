import apiClient from '@shared/services/api';
import {
  WorkScheduleResponse,
  CreateWorkScheduleBody,
  UpdateWorkScheduleBody,
  CreateDayScheduleBody,
  CreateWeekScheduleBody,
  GetWeekScheduleParams,
  GetDayScheduleParams,
} from '@features/work-schdule/types/types';

export const workScheduleApi = {
  /**
   * Lấy tất cả lịch làm việc (lọc theo chi nhánh hiện tại)
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
   * Lấy lịch làm việc theo chi nhánh cụ thể
   */
  getByBranch: async (branchId: string): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get(`/work-schedules/branch/${branchId}`);
    return res.data;
  },

  /**
   * Lấy lịch làm việc theo ID
   */
  getById: async (id: string): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get(`/work-schedules/${id}`);
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

  /**
   * Cập nhật lịch làm việc
   */
  update: async (
    id: string,
    body: UpdateWorkScheduleBody,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.put(`/work-schedules/${id}`, body);
    return res.data;
  },

  /**
   * Xóa lịch làm việc
   */
  delete: async (id: string): Promise<WorkScheduleResponse> => {
    const res = await apiClient.delete(`/work-schedules/${id}`);
    return res.data;
  },

  /**
   * Tạo lịch cho một ngày (sáng + chiều)
   */
  createDaySchedule: async (
    body: CreateDayScheduleBody,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.post('/work-schedules/day', body);
    return res.data;
  },

  /**
   * Tạo lịch cho một tuần
   */
  createWeekSchedule: async (
    body: CreateWeekScheduleBody,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.post('/work-schedules/week', body);
    return res.data;
  },

  /**
   * Lấy lịch của một tuần
   */
  getWeekSchedule: async (
    params: GetWeekScheduleParams,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get('/work-schedules/week', { params });
    return res.data;
  },

  /**
   * Lấy lịch của một ngày
   */
  getDaySchedule: async (
    params: GetDayScheduleParams,
  ): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get('/work-schedules/day', { params });
    return res.data;
  },
};
