import apiClient from "@/services/apiClient";
import type { MediaListItem } from "./listMedia";

export async function getMediaByType(type: string): Promise<MediaListItem[]> {
  return apiClient.get(`/media/type/${encodeURIComponent(type)}`);
}

export default getMediaByType;


