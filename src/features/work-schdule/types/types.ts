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
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkScheduleBody {
  user_id: string;
  branch_id: string;
  date: string;
  shift: string;
}

export interface WorkScheduleResponse {
  success: boolean;
  data: WorkSchedule | WorkSchedule[];
  message?: string;
}
