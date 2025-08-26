import apiClient from "@/services/apiClient";

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
};

export async function createCategory(payload: CreateCategoryPayload) {
  const body: any = { ...payload };
  if (!body.parent_id) delete body.parent_id; // omit when null/undefined/empty
  return apiClient.post("/categories", body);
}

export default createCategory;


