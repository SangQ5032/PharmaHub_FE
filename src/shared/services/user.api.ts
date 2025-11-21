import apiClient from '@shared/services/api';

export interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
  branch_id: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  message?: string;
}

export const userApi = {
  /**
   * Lấy danh sách users của chi nhánh hiện tại
   * Endpoint: GET /api/users/branch/list
   */
  getUsersByBranchList: async (): Promise<UsersResponse> => {
    const res = await apiClient.get('/users/branch/list');
    return res.data;
  },
};
