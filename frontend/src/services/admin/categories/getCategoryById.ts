import apiClient from "@/services/apiClient";

export type CategoryDetail = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | string | null;
  status: string;
  created_by?: number | string;
  created_at?: string;
  modified_by?: number | string;
  modified_at?: string;
};

export async function getCategoryById(id: number | string): Promise<CategoryDetail> {
  return apiClient.get(`/categories/${id}`);
}

export default getCategoryById;


