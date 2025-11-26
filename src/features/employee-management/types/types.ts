export interface Employee {
  _id: string;
  username: string;
  name: string;
  role: string;
  branch_id?: string | null;
  contact?: {
    phone: string;
    email: string;
  };
  salary?: number;
  status?: string;
}

export interface AssignBranchPayload {
  userId: string;
  branchId: string;
}

export interface TransferBranchPayload {
  userId: string;
  newBranchId: string;
}

export interface EmployeeManagementState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
}
