import apiClient from "@/services/apiClient";
import type { FaqListItem } from "./listFaqs";

export type CreateFaqPayload = {
  content: string;
  parent_id?: string;
};

export async function createFaq(
  payload: CreateFaqPayload
): Promise<FaqListItem> {
  const response = (await apiClient.post("/faqs", payload)) as any;

  // Handle API response structure (response is already unwrapped by apiClient interceptor)
  const data = response?.data ?? response;

  // Normalize response to FaqListItem format
  return {
    id: data.id,
    content: data.content,
    parent_id: data.parent_id || data.parent?.id || null,
    status: data.status || "active",
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export default createFaq;
