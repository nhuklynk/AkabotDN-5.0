import apiClient from "@/services/apiClient";
import type { CategoryListItem } from "./listCategories";

export async function getRootCategories(): Promise<CategoryListItem[]> {
  // Assuming backend exposes /categories/roots or /categories?parent_id=null
  try {
    return await apiClient.get("/categories/roots");
  } catch {
    const res = await apiClient.get("/categories", { params: { parent_id: null } });
    return (res as any)?.items ?? res;
  }
}

export default getRootCategories;


