import apiClient from '@shared/services/api';

export interface User {
  _id: string;
  username: string;
  name: string;
  role: string;
  branch_id: string | null;
  contact?: {
    phone: string;
    email: string;
  };
  salary?: number;
  status?: string;
}

export interface CreateUserPayload {
  username: string;
  password_hash: string;
  name: string;
  role: 'employee' | 'branch-manager';
  contact?: {
    phone: string;
    email: string;
  };
  salary?: number;
  status?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export const userApi = {
  /**
   * Lấy danh sách users của chi nhánh hiện tại hoặc chi nhánh chỉ định
   * - Nếu branchId truyền vào: GET /api/users/branch/list?branchId=xxx (cho system_admin)
   * - Nếu không truyền branchId: GET /api/users/branch/list (lấy chi nhánh hiện tại từ token)
   * Endpoint: GET /api/users/branch/list
   */
  getUsersByBranchList: async (
    branchId?: string | null,
  ): Promise<UserResponse> => {
    if (branchId) {
      const res = await apiClient.get('/users/branch/list', {
        params: { branchId },
      });
      return res.data;
    }
    const res = await apiClient.get('/users/branch/list');
    return res.data;
  },

  /**
   * Gán chi nhánh cho nhân viên chưa có chi nhánh
   * Endpoint: POST /api/users/:userId/assign-branch
   */
  assignBranch: async (
    userId: string,
    branchId: string,
  ): Promise<UserResponse> => {
    const res = await apiClient.post(`/users/${userId}/assign-branch`, {
      branchId,
    });
    return res.data;
  },

  /**
   * Chuyển nhân viên từ chi nhánh hiện tại sang chi nhánh mới
   * Endpoint: PATCH /api/users/:userId/transfer-branch
   */
  transferBranch: async (
    userId: string,
    newBranchId: string,
  ): Promise<UserResponse> => {
    const res = await apiClient.patch(`/users/${userId}/transfer-branch`, {
      newBranchId,
    });
    return res.data;
  },

  /**
   * Lấy danh sách tất cả users trong hệ thống
   * Endpoint: GET /api/users
   */
  getAllUsers: async (): Promise<UserResponse> => {
    const res = await apiClient.get('/users');
    return res.data;
  },

  /**
   * Tạo user mới
   * Endpoint: POST /api/users
   */
  createUser: async (payload: CreateUserPayload): Promise<UserResponse> => {
    const res = await apiClient.post('/users', {
      username: payload.username,
      password_hash: payload.password_hash,
      name: payload.name,
      role: payload.role,
      branch_id: null,
      contact: payload.contact,
      salary: payload.salary,
      status: payload.status || 'active',
    });
    return res.data;
  },
};
