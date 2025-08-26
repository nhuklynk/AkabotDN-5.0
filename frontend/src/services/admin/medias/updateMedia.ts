import apiClient from "@/services/apiClient";

export type UpdateMediaPayload = Partial<{
  media_type: string;
  status: string;
}>;

export async function updateMedia(
  id: number | string,
  payload: UpdateMediaPayload
) {
  return apiClient.patch(`/media/${id}`, payload);
}

export default updateMedia;
