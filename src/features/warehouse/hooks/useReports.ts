// src/features/warehouse/hooks/useReports.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import { reportsApi } from '@features/warehouse/api/reports.api';
import { GenerateReportRequest } from '@features/warehouse/types/report.types';

/**
 * Hook to generate report
 */
export function useGenerateReport() {
  return useMutation({
    mutationFn: (data: GenerateReportRequest) =>
      reportsApi.generateReport(data),
  });
}

/**
 * Hook to export report
 */
export function useExportReport() {
  return useMutation({
    mutationFn: (data: GenerateReportRequest) => reportsApi.exportReport(data),
  });
}

/**
 * Hook to get report preview
 */
export function useGetReportPreview(params: GenerateReportRequest) {
  return useQuery({
    queryKey: ['report-preview', params],
    queryFn: () => reportsApi.getReportPreview(params),
    enabled: false, // Only fetch when manually triggered
    staleTime: 0, // Always fetch fresh data
  });
}
