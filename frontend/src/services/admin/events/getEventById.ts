import apiClient from "@/services/apiClient";
import type { EventListItem } from "./listEvents";

export async function getEventById(id: string | number): Promise<EventListItem> {
  const response = await apiClient.get(`/events/${id}`);
  return response as EventListItem;
}

export default getEventById;
