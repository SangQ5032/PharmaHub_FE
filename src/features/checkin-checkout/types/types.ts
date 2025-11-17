import { User, Branch } from '@features/work-schdule/types/types';

export interface Attendance {
  _id: string;
  user_id: User | string;
  branch_id: Branch | string;
  checkin_time: string;
  checkout_time: string | null;
  working_hours: number;
  status: 'checked_in' | 'checked_out';
  createdAt: string;
  updatedAt: string;
}

export interface CheckinBody {
  branch_id?: string;
  checkin_time?: string;
}

export interface CheckoutBody {
  checkout_time?: string;
}

export interface AttendanceResponse {
  success: boolean;
  data: Attendance | Attendance[];
  message?: string;
}
