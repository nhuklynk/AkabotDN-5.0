import apiClient from "../apiClient";

// Types based on the backend API
export interface Faq {
  id: string;
  content: string;
  created_at: string;
}

export interface FaqQueryParams {
  page?: number;
  limit?: number;
  search?: string;
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

export interface CreateFaqData {
  content: string;
}

export interface UpdateFaqData {
  content?: string;
}

class FaqService {
  private readonly baseUrl = "/faqs";

  /**
   * Search and filter FAQs with pagination
   */
  async searchAndFilter(
    params: FaqQueryParams = {}
  ): Promise<PaginatedResponse<Faq>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await apiClient.get(url);

    return response as unknown as PaginatedResponse<Faq>;
  }

  async getAllFaqs(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Faq>> {
    return this.searchAndFilter({
      page,
      limit,
    });
  }

  async getCategories(page: number = 1, limit: number = 10): Promise<Faq[]> {
    const response = await this.getAllFaqs(page, limit);
    return response.data.items;
  }

  async searchFaqs(
    searchTerm: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Faq>> {
    return this.searchAndFilter({
      page,
      limit,
      search: searchTerm,
    });
  }

  async getFaqById(id: string): Promise<Faq> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createFaq(faqData: CreateFaqData): Promise<Faq> {
    const response = await apiClient.post(this.baseUrl, faqData);
    return response.data;
  }

  async updateFaq(id: string, faqData: UpdateFaqData): Promise<Faq> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}`, faqData);
    return response.data;
  }

  async deleteFaq(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Get popular FAQs (most recently created)
   */
  async getPopularFaqs(limit: number = 5): Promise<Faq[]> {
    const response = await this.getAllFaqs(1, limit);
    return response.data.items;
  }
}

// Export a singleton instance
export const faqService = new FaqService();
export default faqService;
