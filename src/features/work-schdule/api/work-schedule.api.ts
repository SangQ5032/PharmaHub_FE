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
import {
  WorkScheduleHistoryResponse,
  WorkScheduleHistoryRecord,
  WorkScheduleHistoryParams,
} from '@features/work-schdule/types/workScheduleHistory.types';

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

  /**
   * ==================== WORK SCHEDULE HISTORY APIs ====================
   */

  /**
   * Employee - Lấy lịch sử làm việc của chính mình
   * Endpoint: GET /api/work-schedules/history/me
   * Authorization: employee
   */
  getMyWorkHistory: async (
    params?: WorkScheduleHistoryParams,
  ): Promise<WorkScheduleHistoryResponse<WorkScheduleHistoryRecord[]>> => {
    const res = await apiClient.get('/work-schedules/history/me', { params });
    return res.data;
  },

  /**
   * Branch Manager - Lấy lịch sử làm việc các nhân viên trong chi nhánh
   * Endpoint: GET /api/work-schedules/history/branch-employees
   * Authorization: branch-manager
   */
  getBranchEmployeesWorkHistory: async (
    params?: WorkScheduleHistoryParams,
  ): Promise<WorkScheduleHistoryResponse<WorkScheduleHistoryRecord[]>> => {
    const res = await apiClient.get(
      '/work-schedules/history/branch-employees',
      {
        params,
      },
    );
    return res.data;
  },

  /**
   * System Admin - Lấy lịch sử làm việc tất cả các chi nhánh
   * Endpoint: GET /api/work-schedules/history/all
   * Authorization: system-admin
   */
  getAllWorkHistory: async (
    params?: WorkScheduleHistoryParams,
  ): Promise<WorkScheduleHistoryResponse<WorkScheduleHistoryRecord[]>> => {
    const res = await apiClient.get('/work-schedules/history/all', { params });
    return res.data;
  },

  /**
   * Lấy chi tiết một bản ghi lịch sử làm việc kèm danh sách hoá đơn
   * Endpoint: GET /api/work-schedules/history/:attendanceId
   * Authorization: All authenticated users
   */
  getWorkHistoryDetail: async (
    attendanceId: string,
  ): Promise<WorkScheduleHistoryResponse<WorkScheduleHistoryRecord>> => {
    const res = await apiClient.get(`/work-schedules/history/${attendanceId}`);
    return res.data;
  },
};
