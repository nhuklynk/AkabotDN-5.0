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

  return apiClient.post("/media", mediaForm, {
    headers: { "Content-Type": "multipart/form-data" },
  }) as unknown as MediaDetail;
}

export default createMedia;
