import apiClient from "@/services/apiClient";

export async function deletePost(id: number | string) {
  return apiClient.delete(`/posts/${id}`);
}

export default deletePost;


