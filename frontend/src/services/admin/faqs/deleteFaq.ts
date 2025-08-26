import apiClient from "@/services/apiClient";

export async function deleteFaq(id: string | number): Promise<void> {
  await apiClient.delete(`/faqs/${id}`);
}

export default deleteFaq;
