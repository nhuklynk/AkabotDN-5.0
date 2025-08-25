import apiClient from "@/services/apiClient";
import { CreatePostPayload } from "./createPost";

export type UpdatePostPayload = Partial<CreatePostPayload> & { id: number | string };

export async function updatePost(id: number | string, payload: Partial<CreatePostPayload>) {
  return apiClient.put(`/posts/${id}`, payload);
}

export default updatePost;


