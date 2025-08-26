import apiClient from "@/services/apiClient";
import type { EventListItem } from "./listEvents";

export type CreateEventPayload = {
  title: string;
  content: string;
  location: string;
  start_time: string;
  end_time?: string;
  countdown_enabled: boolean;
  status: string;
  thumbnail?: File;
  tag_ids?: string[];
  category_ids?: string[];
};

export async function createEvent(
  payload: CreateEventPayload
): Promise<EventListItem> {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("location", payload.location);
  formData.append("start_time", payload.start_time);
  if (payload.end_time) {
    formData.append("end_time", payload.end_time);
  }
  formData.append("countdown_enabled", payload.countdown_enabled.toString());
  formData.append("status", payload.status);

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

    const response = await apiClient.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data as EventListItem;
}

export default createEvent;
