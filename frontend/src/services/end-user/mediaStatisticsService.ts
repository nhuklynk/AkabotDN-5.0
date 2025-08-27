import apiClient from "../apiClient";

// Interface for statistics item
export interface MediaStatisticsItem {
  type: string;
  label: string;
  count: number;
  formatted_count: string;
}

// Interface for the API response
export interface MediaStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    statistics: MediaStatisticsItem[];
  };
  errors: any;
  timestamp: string;
  path: string;
}

export class MediaStatisticsService {
  static async getContentStatistics(): Promise<MediaStatisticsItem[]> {
    try {
      const response = await apiClient.get<MediaStatisticsResponse>('/media/content-statistics');
      
      // Check if response is already unwrapped by interceptor
      if (Array.isArray(response)) {
        // Direct response (interceptor unwrapped it already)
        return response as MediaStatisticsItem[];
      }
      
      // Check if response is wrapped
      if (response && typeof response === 'object') {
        // Handle wrapped response structure
        if ('success' in response && 'data' in response) {
          const wrappedResponse = response as unknown as MediaStatisticsResponse;
          if (wrappedResponse.success && wrappedResponse.data?.statistics) {
            return wrappedResponse.data.statistics;
          }
          throw new Error(wrappedResponse.message || 'Failed to fetch media statistics');
        }
        
        // Handle direct statistics array response
        if ('statistics' in response) {
          return (response as any).statistics;
        }
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching media statistics:', error);
      throw new Error('Failed to fetch media statistics');
    }
  }
}
