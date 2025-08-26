import apiClient from "@/services/apiClient";
import type { FaqListItem } from "./listFaqs";

export type UpdateFaqPayload = {
  content?: string;
  parent_id?: string;
};

export async function updateFaq(id: string | number, payload: UpdateFaqPayload): Promise<FaqListItem> {
  const response = await apiClient.patch(`/faqs/${id}`, payload);
  return response as FaqListItem;
}

export default updateFaq;
