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
   * Lấy danh sách users của chi nhánh hiện tại hoặc chi nhánh chỉ định
   * Endpoint: GET /api/users/branch/list (hiện tại) hoặc GET /api/users/branch/:branchId (chỉ định)
   */
  getUsersByBranchList: async (branchId?: string): Promise<UsersResponse> => {
    if (branchId) {
      const res = await apiClient.get(`/users/branch/${branchId}`);
      return res.data;
    }
    const res = await apiClient.get('/users/branch/list');
    return res.data;
  },
};
