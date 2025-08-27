import apiClient from "@/services/apiClient";
import type { FaqListItem } from "./listFaqs";

export type UpdateFaqPayload = {
  content?: string;
  parent_id?: string;
};

export async function updateFaq(
  id: string | number,
  payload: UpdateFaqPayload
): Promise<FaqListItem> {
  const response = (await apiClient.patch(`/faqs/${id}`, payload)) as any;

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

export default updateFaq;
