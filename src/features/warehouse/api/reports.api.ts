// src/features/warehouse/api/reports.api.ts

import apiClient from '@shared/services/api';
import {
  GenerateReportRequest,
  GenerateReportResponse,
  ExportReportResponse,
} from '@features/warehouse/types/report.types';

/**
 * Reports API
 */
export const reportsApi = {
  /**
   * Generate inventory report
   * POST /api/inventory/report
   */
  generateReport: async (
    data: GenerateReportRequest,
  ): Promise<GenerateReportResponse> => {
    const response = await apiClient.post('/inventory/report', data);

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Không thể tạo báo cáo');
  },

  /**
   * Export report to file (PDF, Excel, CSV)
   * POST /api/inventory/report/export
   */
  exportReport: async (
    data: GenerateReportRequest,
  ): Promise<ExportReportResponse> => {
    const response = await apiClient.post('/inventory/report/export', data, {
      responseType: 'blob', // For file download
    });

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Không thể xuất báo cáo');
  },

  /**
   * Get report preview data
   * GET /api/inventory/report/preview
   */
  getReportPreview: async (
    params: GenerateReportRequest,
  ): Promise<GenerateReportResponse> => {
    const response = await apiClient.get('/inventory/report/preview', {
      params,
    });

    if (response.data.success) {
      return response.data;
    }

    throw new Error(response.data.message || 'Không thể xem trước báo cáo');
  },
};
