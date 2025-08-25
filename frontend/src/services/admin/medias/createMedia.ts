import apiClient from "@/services/apiClient";
import type { MediaDetail } from "./getMediaById";

export type CreateMediaPayload = {
  file: File | Blob;
  file_name?: string;
  media_type?: string;
  status?: string;
};

export async function createMedia(payload: CreateMediaPayload): Promise<MediaDetail> {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.file_name) form.append("file_name", payload.file_name);
  if (payload.media_type) form.append("media_type", payload.media_type);
  if (payload.status) form.append("status", payload.status);
  const res = await apiClient.post<MediaDetail>("/media", form);
  return res as unknown as MediaDetail;
}

export default createMedia;


