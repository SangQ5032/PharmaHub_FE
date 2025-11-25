// src/features/warehouse/index.ts

// Screens
export { default as ImportListScreen } from './screens/ImportListScreen';
export { default as CreateImportScreen } from './screens/CreateImportScreen';
export { default as ImportDetailScreen } from './screens/ImportDetailScreen';
export { default as InventoryListScreen } from './screens/InventoryListScreen';
export { default as InventoryDetailScreen } from './screens/InventoryDetailScreen';
export { default as InventoryDetailWithBatchesScreen } from './screens/InventoryDetailWithBatchesScreen';
export { default as InventoryDetailExpandedScreen } from './screens/InventoryDetailExpandedScreen';
export { default as BatchDetailScreen } from './screens/BatchDetailScreen';
export { default as BatchDetailExpandedScreen } from './screens/BatchDetailExpandedScreen';
export { default as BranchInventoryManagementScreen } from './screens/BranchInventoryManagementScreen';
export { default as ReportSelectionScreen } from './screens/ReportSelectionScreen';
export { default as ReportViewScreen } from './screens/ReportViewScreen';

// Components
export { ImportCard } from './components/ImportCard';
export { InventoryCard } from './components/InventoryCard';
export { InventoryStatsCard } from './components/InventoryStatsCard';
export { StatusBadge } from './components/StatusBadge';
export { MedicineSearchModal } from './components/MedicineSearchModal';
export { ReportTemplateCard } from './components/ReportTemplateCard';
export { ReportSummaryCard } from './components/ReportSummaryCard';
export { BatchCard } from './components/BatchCard';
export { ImportHistoryCard } from './components/ImportHistoryCard';

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
  useGetInventoryByBranchAndMedicine,
  useGetInventoryDetail,
  useGetInventoryStats,
} from './hooks/useInventory';
export {
  useGetBatchesByBranch,
  useGetBatchesByMedicine,
  useGetBatchDetail,
  useGetMedicinesWithBatches,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
} from './hooks/useBatches';
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
  Batch,
  Supplier,
  BranchInfo,
  MedicineInfo,
  GetBatchesQuery,
  GetBatchesResponse,
  GetBatchesByMedicineResponse,
  GetBatchDetailResponse,
  MedicineWithBatches,
  GetMedicinesWithBatchesResponse,
  CreateBatchBody,
  CreateBatchResponse,
  UpdateBatchBody,
  UpdateBatchResponse,
} from './types/batch.types';

export type {
  Medicine,
  GetMedicinesQuery,
  GetMedicinesResponse,
} from './types/medicine.types';

export type {
  Supplier as SupplierType,
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
