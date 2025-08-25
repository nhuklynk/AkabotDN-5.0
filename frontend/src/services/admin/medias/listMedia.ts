import apiClient from "@/services/apiClient";

export type MediaQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  media_type?: string;
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
  const res: any = await apiClient.get("/media", { params });
  const payload = res?.data ?? res;
  const itemsRaw: any[] = Array.isArray(payload) ? payload : (payload?.items ?? []);

  const items: MediaListItem[] = itemsRaw.map((m: any) => ({
    id: m.id,
    file_name: m.file_name,
    mime_type: m.mime_type,
    file_size: m.file_size,
    file_path: m.file_path,
    media_type: m.media_type,
    status: m.status ?? "active",
    created_at: m.created_at,
  }));

  return {
    items,
    total: (payload?.total ?? items.length) as number,
    page: (payload?.page ?? query.page ?? 1) as number,
    limit: (payload?.limit ?? query.limit ?? 10) as number,
  };
}

export default listMedia;


