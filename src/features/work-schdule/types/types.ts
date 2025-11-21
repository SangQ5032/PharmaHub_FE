export interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
}

export interface Branch {
  _id: string;
  name: string;
  address: string;
}

export interface WorkSchedule {
  _id: string;
  user_id: User | string;
  branch_id: Branch | string;
  date: string;
  shift: string;
  created_by: User | string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkScheduleBody {
  user_id: string;
  branch_id: string;
  date: string;
  shift: string;
  note?: string;
}

export interface UpdateWorkScheduleBody {
  note?: string;
}

// API Types for Day Schedule
export interface ScheduleItem {
  user_id: string;
  note?: string;
}

export interface CreateDayScheduleBody {
  branch_id: string;
  date: string;
  morning: ScheduleItem[];
  afternoon: ScheduleItem[];
}

// API Types for Week Schedule
export interface WeekScheduleItem {
  user_id: string;
  date: string;
  shift: 'morning' | 'afternoon';
  note?: string;
}

export interface CreateWeekScheduleBody {
  branch_id: string;
  from: string;
  to: string;
  schedules: WeekScheduleItem[];
}

// API Types for Get Week/Day Schedules
export interface GetWeekScheduleParams {
  branch_id: string;
  from: string;
  to: string;
}

export interface GetDayScheduleParams {
  branch_id: string;
  date: string;
}

export interface WorkScheduleResponse {
  success: boolean;
  data: WorkSchedule | WorkSchedule[];
  message?: string;
  total?: number;
}
