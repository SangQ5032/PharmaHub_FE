import { create } from 'zustand';
import { PayrollDetail, ListPayrollFilters, PayrollStatus } from '../types';

interface PayrollStore {
  // State
  selectedPayroll: PayrollDetail | null;
  payrollFilters: ListPayrollFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedPayroll: (payroll: PayrollDetail | null) => void;
  setPayrollFilters: (filters: ListPayrollFilters) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter helpers
  setFilterBranch: (branchId: string) => void;
  setFilterMonth: (month: string) => void;
  setFilterStatus: (status: PayrollStatus | undefined) => void;
  setFilterUser: (userId: string | undefined) => void;
  setFilterPage: (page: number) => void;
  setFilterLimit: (limit: number) => void;
  resetFilters: () => void;

  // Clear all state
  reset: () => void;
}

const defaultFilters: ListPayrollFilters = {
  branch_id: undefined,
  month: undefined,
  status: undefined,
  user_id: undefined,
  page: 1,
  limit: 10,
};

export const usePayrollStore = create<PayrollStore>(set => ({
  // Initial state
  selectedPayroll: null,
  payrollFilters: { ...defaultFilters },
  isLoading: false,
  error: null,

  // Set selected payroll
  setSelectedPayroll: (payroll: PayrollDetail | null) =>
    set({ selectedPayroll: payroll }),

  // Set all filters
  setPayrollFilters: (filters: ListPayrollFilters) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, ...filters },
    })),

  // Set loading state
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  // Set error
  setError: (error: string | null) => set({ error }),

  // Filter helpers
  setFilterBranch: (branchId: string) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, branch_id: branchId },
    })),

  setFilterMonth: (month: string) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, month },
    })),

  setFilterStatus: (status: PayrollStatus | undefined) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, status },
    })),

  setFilterUser: (userId: string | undefined) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, user_id: userId },
    })),

  setFilterPage: (page: number) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, page },
    })),

  setFilterLimit: (limit: number) =>
    set(state => ({
      payrollFilters: { ...state.payrollFilters, limit },
    })),

  // Reset all filters to defaults
  resetFilters: () => set({ payrollFilters: { ...defaultFilters } }),

  // Reset entire store
  reset: () =>
    set({
      selectedPayroll: null,
      payrollFilters: { ...defaultFilters },
      isLoading: false,
      error: null,
    }),
}));
