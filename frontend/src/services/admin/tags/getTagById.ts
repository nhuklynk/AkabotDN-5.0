import apiClient from "@/services/apiClient";

export type TagDetail = {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  created_by?: number | string;
  created_at?: string;
  modified_by?: number | string;
  modified_at?: string;
};

export async function getTagById(id: number | string): Promise<TagDetail> {
  return apiClient.get(`/tags/${id}`);
}

export default getTagById;


