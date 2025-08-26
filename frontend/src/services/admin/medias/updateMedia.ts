import apiClient from "@/services/apiClient";
import type { MediaDetail } from "./getMediaById";

export type UpdateMediaPayload = Partial<{
  media_type: string;
  status: string;
}>;

export async function updateMedia(
  id: number | string,
  payload: UpdateMediaPayload
): Promise<MediaDetail> {
  const response = (await apiClient.patch(`/media/${id}`, payload)) as any;

  // Handle API response structure (response is already unwrapped by apiClient interceptor)
  const data = response?.data ?? response;

  // Normalize response to MediaDetail format
  return {
    id: data.id,
    file_name: data.file_name,
    mime_type: data.mime_type,
    file_size: data.file_size,
    file_path: data.file_path,
    media_type: data.media_type,
    status: data.status || "active",
    created_by: data.created_by,
    created_at: data.created_at,
    modified_by: data.modified_by,
    modified_at: data.modified_at,
  };
}

export default updateMedia;
