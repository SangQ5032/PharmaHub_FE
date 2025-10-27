// src/features/auth/api/authApi.ts
// import { apiClient } from '@/shared/api/client'
// import { ApiResponse } from '@/shared/types/api'

import apiClient from "../../../shared/services/api";
import { ApiResponse } from "../../../shared/types/api";

export type LoginPayload = { email: string; password: string }
export type LoginResponse = { accessToken: string; refreshToken: string }

export const authApi = {
  login: (body: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body),

  refresh: (token: string) =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { token }),
}
