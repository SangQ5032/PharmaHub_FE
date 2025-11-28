// src/features/warehouse/index.ts

// Screens
export { default as ImportListScreen } from './screens/ImportListScreen';
export { default as CreateImportScreen } from './screens/CreateImportScreen';
export { default as ImportDetailScreen } from './screens/ImportDetailScreen';
export { default as InventoryListScreen } from './screens/InventoryListScreen';
export { default as InventoryDetailScreen } from './screens/InventoryDetailScreen';
export { default as ReportSelectionScreen } from './screens/ReportSelectionScreen';
export { default as ReportViewScreen } from './screens/ReportViewScreen';
export { default as WarehouseHubScreen } from './screens/WarehouseHubScreen';

// Components
export { ImportCard } from './components/ImportCard';
export { InventoryCard } from './components/InventoryCard';
export { InventoryStatsCard } from './components/InventoryStatsCard';
export { StatusBadge } from './components/StatusBadge';
export { MedicineSearchModal } from './components/MedicineSearchModal';
export { ReportTemplateCard } from './components/ReportTemplateCard';
export { ReportSummaryCard } from './components/ReportSummaryCard';

// Hooks
export {
  useGetImports,
  useGetImportDetail,
  useCreateImport,
  useUpdateImportStatus,
  useCancelImport,
  useGetImportsByBranch,
  useGetImportStats,
} from './hooks/useImports';
export {
  useGetInventoryByBranch,
  useGetAllInventory,
  useGetInventoryDetail,
  useGetInventoryStats,
} from './hooks/useInventory';
export { useGetMedicines } from './hooks/useMedicines';
export { useGetSuppliers, useGetActiveSuppliers } from './hooks/useSuppliers';
export {
  useGenerateReport,
  useExportReport,
  useGetReportPreview,
} from './hooks/useReports';

// Types
export type {
  Import,
  ImportItem,
  ImportRecord,
  CreateImportRequest,
  CreateImportBody,
  GetImportsQuery,
  GetImportsResponse,
  GetImportDetailResponse,
  CreateImportResponse,
  UpdateImportStatusBody,
  CancelImportBody,
  GetImportStatsResponse,
} from './types/import.types';

export type {
  InventoryItem,
  InventoryStats,
  GetInventoryQuery,
  GetInventoryResponse,
  GetInventoryDetailResponse,
  GetInventoryStatsResponse,
} from './types/inventory.types';

export type {
  Medicine,
  GetMedicinesQuery,
  GetMedicinesResponse,
} from './types/medicine.types';

export type {
  Supplier,
  GetSuppliersQuery,
  GetSuppliersResponse,
} from './types/supplier.types';

export type {
  ReportType,
  ReportFormat,
  ReportFilter,
  ReportConfig,
  ReportData,
  GenerateReportRequest,
  GenerateReportResponse,
  ExportReportResponse,
  ReportTemplate,
} from './types/report.types';
