import apiClient from "@/services/apiClient";
import { CreateCategoryPayload } from "./createCategory";

export async function updateCategory(id: number | string, payload: Partial<CreateCategoryPayload>) {
  return apiClient.put(`/categories/${id}`, payload);
}

export default updateCategory;


