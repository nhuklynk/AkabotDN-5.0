import apiClient from "@/services/apiClient";
import type { CategoryDetail } from "./getCategoryById";

export async function getCategoryBySlug(slug: string): Promise<CategoryDetail> {
  return apiClient.get(`/categories/slug/${encodeURIComponent(slug)}`);
}

export default getCategoryBySlug;


