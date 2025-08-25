import apiClient from "@/services/apiClient";
import { CreateTagPayload } from "./createTag";
import type { TagDetail } from "./getTagById";

export async function updateTag(id: number | string, payload: Partial<CreateTagPayload>): Promise<TagDetail> {
  const res = await apiClient.put<TagDetail>(`/tags/${id}`, payload);
  return res as unknown as TagDetail;
}

export default updateTag;


