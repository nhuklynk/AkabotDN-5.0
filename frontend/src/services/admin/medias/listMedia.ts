import apiClient from "@/services/apiClient";

export type MediaQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  media_type?: string; // image | video | audio | document | other
};

export type MediaListItem = {
  id: number | string;
  file_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  media_type: string;
  status: string;
  created_at?: string;
};

export type ListMediaResponse = {
  items: MediaListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function listMedia(query: MediaQuery = {}): Promise<ListMediaResponse> {
  const params = { ...query } as Record<string, any>;
  return apiClient.get("/media", { params });
}

export default listMedia;


