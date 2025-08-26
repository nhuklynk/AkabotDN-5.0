import apiClient from "@/services/apiClient";

export type MediaDetail = {
  id: number | string;
  file_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  media_type: string;
  status: string;
  created_by?: number | string;
  created_at?: string;
  modified_by?: number | string;
  modified_at?: string;
};

export async function getMediaById(id: number | string): Promise<MediaDetail> {
  const response = (await apiClient.get(`/media/${id}`)) as any;

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

export default getMediaById;
