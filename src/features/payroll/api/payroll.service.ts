import {
  ApiResponse,
  PayrollPreview,
  PayrollDetail,
  CreatePayrollRequest,
  UpdatePayrollRequest,
  ApprovePayrollRequest,
  RejectPayrollRequest,
  ListPayrollFilters,
  BranchPayrollSummary,
} from '../types';
import apiClient from '@shared/services/api';

const PAYROLL_ENDPOINT = '/payrolls';

/**
 * GET /api/payrolls/preview
 * Calculate payroll for a specific user and month
 */
export const getPayrollPreview = async (
  userId: string,
  branchId: string,
  month: string,
): Promise<ApiResponse<PayrollPreview>> => {
  const response = await apiClient.get(`${PAYROLL_ENDPOINT}/preview`, {
    params: { user_id: userId, branch_id: branchId, month },
  });
  return response.data || response;
};

/**
 * POST /api/payrolls
 * Create and save a payroll record
 */
export const createPayroll = async (
  data: CreatePayrollRequest,
): Promise<ApiResponse<PayrollDetail>> => {
  const response = await apiClient.post(`${PAYROLL_ENDPOINT}`, data);
  return response.data || response;
};

/**
 * GET /api/payrolls
 * Get list of payrolls with filters and pagination
 */
export const getPayrollList = async (
  filters: ListPayrollFilters,
): Promise<ApiResponse<PayrollDetail[]>> => {
  const response = await apiClient.get(`${PAYROLL_ENDPOINT}`, {
    params: filters,
  });
  return response.data || response;
};

/**
 * GET /api/payrolls/:id
 * Get detailed information of a specific payroll
 */
export const getPayrollDetail = async (
  payrollId: string,
): Promise<ApiResponse<PayrollDetail>> => {
  const response = await apiClient.get(`${PAYROLL_ENDPOINT}/${payrollId}`);
  return response.data || response;
};

/**
 * PUT /api/payrolls/:id
 * Update payroll (add bonus or note)
 */
export const updatePayroll = async (
  payrollId: string,
  data: UpdatePayrollRequest,
): Promise<ApiResponse<PayrollDetail>> => {
  const response = await apiClient.put(
    `${PAYROLL_ENDPOINT}/${payrollId}`,
    data,
  );
  return response.data || response;
};

/**
 * PUT /api/payrolls/:id/approve
 * Approve a payroll
 */
export const approvePayroll = async (
  payrollId: string,
  data: ApprovePayrollRequest,
): Promise<ApiResponse<PayrollDetail>> => {
  const response = await apiClient.put(
    `${PAYROLL_ENDPOINT}/${payrollId}/approve`,
    data,
  );
  return response.data || response;
};

/**
 * PUT /api/payrolls/:id/reject
 * Reject a payroll
 */
export const rejectPayroll = async (
  payrollId: string,
  data: RejectPayrollRequest,
): Promise<ApiResponse<PayrollDetail>> => {
  const response = await apiClient.put(
    `${PAYROLL_ENDPOINT}/${payrollId}/reject`,
    data,
  );
  return response.data || response;
};

/**
 * GET /api/payrolls/branch/:branch_id/summary
 * Get payroll summary statistics for a branch
 */
export const getBranchPayrollSummary = async (
  branchId: string,
  month: string,
): Promise<ApiResponse<BranchPayrollSummary>> => {
  const response = await apiClient.get(
    `${PAYROLL_ENDPOINT}/branch/${branchId}/summary`,
    {
      params: { month },
    },
  );
  return response.data || response;
};
