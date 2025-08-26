import apiClient from "@/services/apiClient";
import type { FaqListItem } from "./listFaqs";

export type CreateFaqPayload = {
  content: string;
  parent_id?: string;
};

export async function createFaq(payload: CreateFaqPayload): Promise<FaqListItem> {
  const response = await apiClient.post("/faqs", payload);
  return response as FaqListItem;
}

export default createFaq;
