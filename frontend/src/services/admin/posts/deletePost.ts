import apiClient from "@/services/apiClient";

export const deletePost = async (id: string | number) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response?.data ?? response;
};


