import apiClient from "@/services/apiClient";
import type { TagDetail } from "./getTagById";

export type CreateTagPayload = {
  name: string;
  slug: string;
  description?: string;
  status?: string; // active/inactive
};

export async function createTag(payload: CreateTagPayload): Promise<TagDetail> {
  const res = await apiClient.post<TagDetail>("/tags", payload);
  return res as unknown as TagDetail;
}

export default createTag;


