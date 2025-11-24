import { User, Branch } from '@features/work-schdule/types/types';

export interface Attendance {
  _id: string;
  user_id: User | string;
  branch_id: Branch | string;
  checkin_time: string;
  checkout_time: string | null;
  working_hours: number;
  status: 'checked_in' | 'checked_out';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckinBody {
  latitude: number;
  longitude: number;
}

export interface CheckoutBody {
  // Empty body for checkout
}

export interface AttendanceResponse {
  success: boolean;
  data: Attendance | Attendance[];
  message?: string;
}
