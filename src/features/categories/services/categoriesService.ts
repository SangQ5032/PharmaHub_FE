import api from '@shared/services/api';
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoriesListResponse,
} from '../types';

export type ListCategoriesParams = {
  q?: string;
  page?: number;
  limit?: number;
  sort?: string; // 'name_asc' | 'name_desc' | backend custom
};

function normalizeListPayload(payload: any): CategoriesListResponse {
  if (Array.isArray(payload)) {
    return { data: payload };
  }
  if (payload?.data) {
    if (Array.isArray(payload.data))
      return {
        data: payload.data,
        page: payload.page,
        limit: payload.limit,
        total: payload.total,
      };
    if (Array.isArray(payload.data.items))
      return {
        data: payload.data.items,
        page: payload.data.page ?? payload.page,
        limit: payload.data.limit ?? payload.limit,
        total: payload.data.total ?? payload.total,
      };
  }
  if (Array.isArray(payload?.items)) {
    return {
      data: payload.items,
      page: payload.page,
      limit: payload.limit,
      total: payload.total,
    };
  }
  if (Array.isArray(payload?.results)) {
    return {
      data: payload.results,
      page: payload.page,
      limit: payload.limit,
      total: payload.total,
    };
  }
  return { data: [] };
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const res = await api.post('/categories', payload);
  return res.data;
}

export async function listCategories(
  params: ListCategoriesParams = {},
): Promise<CategoriesListResponse> {
  const res = await api.get('/categories', { params });
  return normalizeListPayload(res.data);
}

export async function getCategoryById(id: string): Promise<Category> {
  const res = await api.get(`/categories/${id}`);
  return res.data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: string): Promise<any> {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
}
