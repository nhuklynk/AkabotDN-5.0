import apiClient from "@/services/apiClient";

export type CreateTagPayload = {
  name: string;
  slug: string;
  description?: string;
  status?: string; // active/inactive
};

export async function createTag(payload: CreateTagPayload) {
  return apiClient.post("/tags", payload);
}

export default createTag;


