import apiClient from "@/services/apiClient";

export async function deleteTag(id: number | string) {
  return apiClient.delete(`/tags/${id}`);
}

export default deleteTag;


