import { userApi } from '@shared/services/user.api';

const employeeApi = {
  /**
   * Lấy danh sách nhân viên của chi nhánh
   */
  getEmployeesByBranch: userApi.getUsersByBranchList,

  /**
   * Gán chi nhánh cho nhân viên chưa có chi nhánh
   */
  assignBranch: userApi.assignBranch,

  /**
   * Chuyển nhân viên sang chi nhánh khác
   */
  transferBranch: userApi.transferBranch,

  /**
   * Lấy danh sách tất cả users trong hệ thống
   */
  getAllUsers: userApi.getAllUsers,

  /**
   * Tạo user mới
   */
  createUser: userApi.createUser,
};

export default employeeApi;
