import apiClient from "@/services/apiClient";
import type { MediaDetail } from "./getMediaById";

export type CreateMediaPayload = {
  file: File | Blob;
  file_name?: string;
  media_type?: string;
  status?: string;
};

export async function createMedia(
  payload: CreateMediaPayload
): Promise<MediaDetail> {
  const uploadForm = new FormData();
  uploadForm.append("file", payload.file);
  uploadForm.append("bucket", "public");
  uploadForm.append("scope", "media");
  const uploadRes: any = await apiClient.post("/storage/upload", uploadForm, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const uploaded = uploadRes?.data ?? uploadRes;

  const fileName = payload.file_name || uploaded?.fileName;
  const body = {
    file_path: uploaded?.arn || uploaded?.fileName,
    file_name: fileName,
    mime_type: uploaded?.contentType,
    file_size: uploaded?.fileSize,
    media_type: payload.media_type,
    status: payload.status,
  } as any;

  return apiClient.post("/media", body) as unknown as MediaDetail;
}

export default createMedia;
