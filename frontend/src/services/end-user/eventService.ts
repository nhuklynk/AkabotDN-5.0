import apiClient from "@/services/apiClient";
import { Status } from "./postService";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  thumbnail_url_id?: string;
  countdown_enabled: boolean;
  tags?: Array<{ id: string; name: string }>;
  categories?: Array<{ id: string; name: string }>;
  created_at: string;
  modified_at: string;
  status: string;
  created_by: string;
  modified_by: string | null;
}

export enum EventStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  title?: string;
  location?: string;
  status?: Status;
  start_date?: string;
  end_date?: string;
  tag_id?: string;
  category_id?: string;
  countdown_enabled?: boolean;
}

export interface PaginatedEventResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: any;
  timestamp?: string;
  path?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

class EventService {
  private readonly baseUrl = "/events";

  /**
   * Search and filter events with pagination
   */
  async searchAndFilter(
    params: EventQueryParams
  ): Promise<PaginatedEventResponse<Event>> {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      // Add filter params
      if (params.title) queryParams.append("title", params.title);
      if (params.location) queryParams.append("location", params.location);
      if (params.status) queryParams.append("status", params.status);
      if (params.start_date)
        queryParams.append("start_date", params.start_date);
      if (params.end_date) queryParams.append("end_date", params.end_date);
      if (params.tag_id) queryParams.append("tag_id", params.tag_id);
      if (params.category_id)
        queryParams.append("category_id", params.category_id);
      if (params.countdown_enabled !== undefined)
        queryParams.append(
          "countdown_enabled",
          params.countdown_enabled.toString()
        );

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      console.log("Making API request to:", url);
      const response = (await apiClient.get(
        url
      )) as PaginatedEventResponse<Event>;
      console.log("Raw API response:", response);
      return response;
    } catch (error) {
      console.error("Event search error:", error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get event by slug
   */
  async getBySlug(slug: string): Promise<Event> {
    try {
      const response = (await apiClient.get(
        `${this.baseUrl}/${slug}`
      )) as ApiResponse<Event>;

      console.log("Event by slug response:", response);

      if (!response.success || !response.data) {
        throw new Error("Event not found");
      }

      return response.data;
    } catch (error) {
      console.error("Event fetch by slug error:", error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get event by id
   */
  async getById(id: string): Promise<Event> {
    try {
      const response = (await apiClient.get(
        `${this.baseUrl}/${id}`
      )) as ApiResponse<Event>;

      console.log("Event by id response:", response);

      if (!response.success || !response.data) {
        throw new Error("Event not found");
      }

      return response.data;
    } catch (error) {
      console.error("Event fetch by id error:", error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get published events
   */
  async getPublishedEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedEventResponse<Event>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.ACTIVE,
    });
  }

  /**
   * Get upcoming events (future events)
   */
  async getUpcomingEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedEventResponse<Event>> {
    const now = new Date().toISOString();

    return this.searchAndFilter({
      page,
      limit,
      status: Status.ACTIVE,
      start_date: now, // Filter for events starting from now
    });
  }

  /**
   * Get events with countdown enabled
   */
  async getCountdownEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedEventResponse<Event>> {
    return this.searchAndFilter({
      page,
      limit,
      status: Status.ACTIVE,
      countdown_enabled: true,
    });
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || "An error occurred";
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      return new Error("No response from server");
    } else {
      // Something else happened
      return new Error(error.message || "Unknown error");
    }
  }
}

// Export singleton instance
export const eventService = new EventService();
export default eventService;
