// src/shared/services/api.ts
import axios from 'axios';
import {store} from '../../app/store';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Request interceptor: attach token from redux
apiClient.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: no refresh logic (A1)
apiClient.interceptors.response.use(
  res => res,
  err => {
    // B1: just throw forward
    return Promise.reject(err);
  },
);

export default apiClient;
