import api from '@shared/services/api';

const PREFIX = '/branches';

const branchApi = {
  getBranches: async () => {
    const res = await api.get(PREFIX);
    return res.data;
  },
  getBranchById: async (id: string) => {
    const res = await api.get(`${PREFIX}/${id}`);
    return res.data;
  },
  createBranch: async (payload: any) => {
    const res = await api.post(PREFIX, payload);
    return res.data;
  },
  updateBranch: async (id: string, payload: any) => {
    const res = await api.put(`${PREFIX}/${id}`, payload);
    return res.data;
  },
  deleteBranch: async (id: string) => {
    const res = await api.delete(`${PREFIX}/${id}`);
    return res.data;
  },
  getInventory: async (id: string) => {
    const res = await api.get(`${PREFIX}/${id}/inventory`);
    return res.data;
  },
  getInventoryReport: async (id: string) => {
    const res = await api.get(`${PREFIX}/${id}/reports/inventory`);
    return res.data;
  },
};

export default branchApi;
