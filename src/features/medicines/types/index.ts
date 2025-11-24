export type Category = {
  _id: string;
  name: string;
  description: string;
};

export type Medicine = {
  _id: string;
  name: string;
  generic_name: string;
  brand_name: string;
  dosage_form: string;
  strength: string;
  unit: string;
  packaging: string;
  category_id: Category;
  prescription_required: boolean;
  is_controlled: boolean;
  retail_price: number;
  minimum_price: number | null;
  max_price: number | null;
  manufacturer: string;
  country_of_origin: string;
  indications: string;
  contraindications: string;
  side_effects: string;
  usage_instructions: string;
  storage_conditions: string;
  registration_number: string;
  barcode: string;
  alert_threshold: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type MedicinesResponse = {
  success: boolean;
  message: string;
  data: Medicine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type Batch = {
  _id: string;
  batch_number: string;
  quantity: number;
  expiry_date: string;
  import_price: number;
  supplier_id: string;
};

export type BranchInventory = {
  branch_id: string;
  branch_name: string;
  branch_address: string;
  branch_phone: string;
  total_quantity: number;
  in_stock: string;
  batches: Batch[];
};

export type InventoryAllBranches = {
  medicine_id: string;
  medicine_name: string;
  generic_name: string;
  brand_name: string;
  unit: string;
  retail_price: number;
  alert_threshold: number;
  total_quantity: number;
  branches: BranchInventory[];
};

export type InventoryResponse = {
  success: boolean;
  message: string;
  data: InventoryAllBranches;
};
