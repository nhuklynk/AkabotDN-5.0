import apiClient from "@/services/apiClient";
import type { MediaDetail } from "./getMediaById";

export type CreateMediaPayload = {
  file: File | Blob;
  media_type?: string;
};

export async function createMedia(
  payload: CreateMediaPayload
): Promise<MediaDetail> {
  const mediaForm = new FormData();
  mediaForm.append("file", payload.file);
  if (payload.media_type) {
    mediaForm.append("media_type", payload.media_type);
  }

  const response = (await apiClient.post("/media", mediaForm, {
    headers: { "Content-Type": "multipart/form-data" },
  })) as any;

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

export default createMedia;
