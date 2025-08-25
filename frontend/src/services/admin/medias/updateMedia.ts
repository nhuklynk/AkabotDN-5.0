import apiClient from "@/services/apiClient";

export type UpdateMediaPayload = Partial<{
  file_name: string;
  media_type: string;
  status: string;
}>;

export async function updateMedia(id: number | string, payload: UpdateMediaPayload) {
  return apiClient.put(`/media/${id}`, payload);
}

export default updateMedia;


