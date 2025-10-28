import apiClient from '@shared/services/api';
import { LoginBody, LoginData } from '@features/auth/types/types';

export const authApi = {
  login: async (body: LoginBody): Promise<LoginData> => {
    const res = await apiClient.post('/auth/login', body);
    // res.data = { code, status, data: {...} }
    return res.data.data; // ✅ trả thẳng object sạch
  },

  profile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data; // ✅ cũng clean luôn
  },
};
