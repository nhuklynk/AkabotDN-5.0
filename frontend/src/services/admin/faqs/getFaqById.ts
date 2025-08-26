import apiClient from "@/services/apiClient";
import type { FaqListItem } from "./listFaqs";

export async function getFaqById(id: string | number): Promise<FaqListItem> {
  const response = await apiClient.get(`/faqs/${id}`);
  return response as FaqListItem;
}

export default getFaqById;
