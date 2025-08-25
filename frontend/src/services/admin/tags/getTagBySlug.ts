import apiClient from "@/services/apiClient";
import type { TagDetail } from "./getTagById";

export async function getTagBySlug(slug: string): Promise<TagDetail> {
  return apiClient.get(`/tags/slug/${encodeURIComponent(slug)}`);
}

export default getTagBySlug;


