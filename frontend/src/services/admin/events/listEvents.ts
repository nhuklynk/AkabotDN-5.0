import apiClient from "@/services/apiClient";

export type EventQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  title?: string;
  location?: string;
  public_status?: string;
  start_date?: string;
  end_date?: string;
  tag_id?: string;
  category_id?: string;
  countdown_enabled?: boolean;
};

export type EventListItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time?: string;
  countdown_enabled: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  tags?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
};

export type ListEventsResponse = {
  items: EventListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

export async function listEvents(query: EventQuery = {}): Promise<ListEventsResponse> {
  const params = { ...query } as Record<string, any>;
  
  try {
    const res: any = await apiClient.get("/events", { params });
    console.log("API response:", res);
    const payload = res?.data ?? res;
    console.log("payload", payload);
    const itemsRaw: any[] = Array.isArray(payload) ? payload : (payload?.items ?? []);
    console.log("itemsRaw", itemsRaw);

    const items: EventListItem[] = itemsRaw.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      start_time: event.start_time,
      end_time: event.end_time,
      countdown_enabled: event.countdown_enabled,
      status: event.status ?? "active",
      created_at: event.created_at,
      updated_at: event.updated_at,
      thumbnail: event.thumbnail,
      tags: event.tags,
      categories: event.categories,
    }));

    return {
      items,
      total: (payload?.total ?? items.length) as number,
      page: (payload?.page ?? query.page ?? 1) as number,
      limit: (payload?.limit ?? query.limit ?? 10) as number,
      totalPages: payload?.totalPages,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export default listEvents;
