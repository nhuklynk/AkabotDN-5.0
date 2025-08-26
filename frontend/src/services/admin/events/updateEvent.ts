import apiClient from "@/services/apiClient";
import type { EventListItem } from "./listEvents";

export type UpdateEventPayload = {
  title?: string;
  content?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  countdown_enabled?: boolean;
  status?: string;
  thumbnail?: File;
  tag_ids?: string[];
  category_ids?: string[];
};

export async function updateEvent(
  id: string | number,
  payload: UpdateEventPayload
): Promise<EventListItem> {
  const formData = new FormData();

  // Add basic fields if provided
  if (payload.title) formData.append("title", payload.title);
  if (payload.content) formData.append("content", payload.content);
  if (payload.location) formData.append("location", payload.location);
  if (payload.start_time) formData.append("start_time", payload.start_time);
  if (payload.end_time) formData.append("end_time", payload.end_time);
  if (payload.countdown_enabled !== undefined) {
    formData.append("countdown_enabled", payload.countdown_enabled.toString());
  }
  if (payload.status) formData.append("status", payload.status);

  // Add thumbnail if provided
  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  // Add tag IDs
  if (payload.tag_ids && payload.tag_ids.length > 0) {
    payload.tag_ids.forEach((tagId) => {
      formData.append("tag_ids", tagId);
    });
  }

  // Add category IDs
  if (payload.category_ids && payload.category_ids.length > 0) {
    payload.category_ids.forEach((categoryId) => {
      formData.append("category_ids", categoryId);
    });
  }

  const response = (await apiClient.patch(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })) as any;

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

export default updateEvent;
