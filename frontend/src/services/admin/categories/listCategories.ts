import apiClient from "@/services/apiClient";

export type CategoryQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string; // active/inactive
  parent_id?: number | string | null;
};

export type CategoryListItem = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | string | null;
  status: string;
  created_at?: string;
};

export type ListCategoriesResponse = {
  items: CategoryListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function listCategories(query: CategoryQuery = {}): Promise<ListCategoriesResponse> {
  const params = { ...query } as Record<string, any>;
  return apiClient.get("/categories", { params });
}

export default listCategories;


