import apiClient from "@/services/apiClient";
import { CreateTagPayload } from "./createTag";

export async function updateTag(id: number | string, payload: Partial<CreateTagPayload>) {
  return apiClient.put(`/tags/${id}`, payload);
}

export default updateTag;


