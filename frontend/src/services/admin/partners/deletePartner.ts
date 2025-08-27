import apiClient from "@/services/apiClient";

export async function deletePartner(id: string | number): Promise<void> {
  await apiClient.delete(`/partners/${id}`);
}

export default deletePartner;
