import apiClient from "@/services/apiClient";

export async function deleteMedia(id: number | string) {
  return apiClient.delete(`/media/${id}`);
}

export default deleteMedia;


