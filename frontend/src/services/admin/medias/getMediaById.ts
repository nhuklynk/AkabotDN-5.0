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
  return apiClient.get(`/media/${id}`);
}

export default getMediaById;


