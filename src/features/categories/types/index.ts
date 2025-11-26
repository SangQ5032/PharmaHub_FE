export type Category = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
};

export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
};

export type CategoriesListResponse = {
  data: Category[];
  page?: number;
  limit?: number;
  total?: number;
};
