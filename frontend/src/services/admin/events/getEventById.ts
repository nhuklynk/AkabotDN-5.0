import apiClient from "@/services/apiClient";
import type { EventListItem } from "./listEvents";

export async function getEventById(
  id: string | number
): Promise<EventListItem> {
  const response = (await apiClient.get(`/events/${id}`)) as any;

  // Handle API response structure (response is already unwrapped by apiClient interceptor)
  const data = response?.data ?? response;

  // Normalize response to EventListItem format
  return {
    id: data.id,
    title: data.title,
    description: data.description || data.content, // Handle both API field names
    location: data.location,
    start_time: data.start_time,
    end_time: data.end_time,
    countdown_enabled: data.countdown_enabled,
    status: data.status || "active",
    created_at: data.created_at,
    updated_at: data.updated_at || data.modified_at,
    thumbnail: data.thumbnail,
    tags: data.tags,
    categories: data.categories,
  };
}

export default getEventById;
