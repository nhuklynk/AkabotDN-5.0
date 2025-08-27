import apiClient from "../apiClient";

export enum MediaType {
  POST = 'post',
  EVENT = 'event',
  MEMBER = 'member',
  OTHER = 'other',
  DOCUMENT_VIDEO = 'document_video',
  DOCUMENT_IMAGE = 'document_image',
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  media_url: string;
  mime_type: string;
  file_size: number;
  media_type: string;
  created_at: string;
  modified_at: string;
  created_by: string;
  modified_by: string;
  status: string;
}

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  type?: MediaType;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginatedResponse<T> {
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
  errors: null;
  timestamp: string;
  path: string;
}

class MediaService {
  private readonly baseUrl = "/media";

  /**
   * Get media by type with pagination
   */
  async getMediaByType(
    type: MediaType,
    params: Omit<MediaQueryParams, 'type'> = {}
  ): Promise<PaginatedResponse<MediaItem>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.date_from) queryParams.append("date_from", params.date_from);
    if (params.date_to) queryParams.append("date_to", params.date_to);

    const url = `${this.baseUrl}/type/${type}?${queryParams.toString()}`;

    // apiClient interceptor returns response.data directly
    const response = await apiClient.get(url);

    // response is already the data structure we need
    return response as unknown as PaginatedResponse<MediaItem>;
  }

  /**
   * Get all media with pagination and filtering
   */
  async searchAndFilter(
    params: MediaQueryParams = {}
  ): Promise<PaginatedResponse<MediaItem>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.type) queryParams.append("type", params.type);
    if (params.search) queryParams.append("search", params.search);
    if (params.date_from) queryParams.append("date_from", params.date_from);
    if (params.date_to) queryParams.append("date_to", params.date_to);

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await apiClient.get(url);
    return response as unknown as PaginatedResponse<MediaItem>;
  }

  /**
   * Get media item by ID
   */
  async getMediaById(id: string): Promise<MediaItem> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get recent media items
   */
  async getRecentMedia(limit: number = 6): Promise<MediaItem[]> {
    const response = await this.searchAndFilter({
      page: 1,
      limit,
    });
    return response.data.items;
  }
}

// Export a singleton instance
export const mediaService = new MediaService();
export default mediaService;
