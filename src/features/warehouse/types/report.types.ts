// src/features/warehouse/types/report.types.ts

import { InventoryItem } from './inventory.types';

/**
 * Report Types
 */
export type ReportType =
  | 'inventory'
  | 'low_stock'
  | 'out_of_stock'
  | 'expiring';

/**
 * Report Format
 */
export type ReportFormat = 'pdf' | 'excel' | 'csv';

/**
 * Report Filter Options
 */
export interface ReportFilter {
  branch_id?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  status?: 'normal' | 'low' | 'out_of_stock';
}

/**
 * Report Configuration
 */
export interface ReportConfig {
  type: ReportType;
  format: ReportFormat;
  filter: ReportFilter;
  title?: string;
  description?: string;
}

/**
 * Report Data
 */
export interface ReportData {
  _id: string;
  type: ReportType;
  title: string;
  description?: string;
  branch_id?: string;
  branch?: {
    _id: string;
    name: string;
    address: string;
  };
  filter: ReportFilter;
  data: InventoryItem[];
  summary: {
    total_items: number;
    total_medicines: number;
    total_value: number;
    low_stock_count: number;
    out_of_stock_count: number;
  };
  created_at: string;
  created_by?: string;
}

/**
 * Generate Report Request
 */
export interface GenerateReportRequest {
  type: ReportType;
  format: ReportFormat;
  branch_id?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  status?: 'normal' | 'low' | 'out_of_stock';
}

/**
 * Generate Report Response
 */
export interface GenerateReportResponse {
  success: boolean;
  message: string;
  data: ReportData;
}

/**
 * Export Report Response
 */
export interface ExportReportResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename: string;
    format: ReportFormat;
  };
}

/**
 * Report Template
 */
export interface ReportTemplate {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  icon: string;
  color: string;
  defaultFormat: ReportFormat;
}
