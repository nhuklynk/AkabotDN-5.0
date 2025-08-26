import apiClient from "@/services/apiClient";

export async function deleteEvent(id: string | number): Promise<void> {
  await apiClient.delete(`/events/${id}`);
}

export default deleteEvent;
