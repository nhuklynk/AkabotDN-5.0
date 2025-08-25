import apiClient from "@/services/apiClient";

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | string | null;
  status?: string; // active/inactive
};

export async function createCategory(payload: CreateCategoryPayload) {
  return apiClient.post("/categories", payload);
}

export default createCategory;


