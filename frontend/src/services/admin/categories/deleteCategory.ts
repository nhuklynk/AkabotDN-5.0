import apiClient from "@/services/apiClient";

export async function deleteCategory(id: number | string) {
  return apiClient.delete(`/categories/${id}`);
}

export default deleteCategory;


