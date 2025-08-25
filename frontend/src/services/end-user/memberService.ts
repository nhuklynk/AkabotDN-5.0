import apiClient from "../apiClient";
import {
  Member,
  MemberApiResponse,
  MemberQueryParams,
} from "@/services/end-user/types/member";

// Additional types for member operations
export interface CreateMemberData {
  membership_type: "corporate" | "individual" | "student";
  job_title: string;
  assistant_info?: string;
  membership_registration_form_url?: string;
  work_unit: string;
  expertise_level: "beginner" | "intermediate" | "advanced" | "expert";
  curriculum_vitae_url?: string;
  user_id: string;
  company_id?: string;
}

export interface UpdateMemberData {
  membership_type?: "corporate" | "individual" | "student";
  job_title?: string;
  assistant_info?: string;
  membership_registration_form_url?: string;
  work_unit?: string;
  expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
  curriculum_vitae_url?: string;
  company_id?: string;
}

class MemberService {
  private readonly baseUrl = "/members";

  /**
   * Search and filter members with pagination
   */
  async searchAndPaginate(
    params: MemberQueryParams = {}
  ): Promise<MemberApiResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.company_id) queryParams.append("company_id", params.company_id);
    if (params.status) queryParams.append("status", params.status);

    const url = `${this.baseUrl}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    // apiClient interceptor returns response.data directly
    const response = await apiClient.get(url);

    // response is already the data structure we need
    return response as unknown as MemberApiResponse;
  }

  /**
   * Get all members with pagination
   */
  async getMembers(params: MemberQueryParams = {}): Promise<MemberApiResponse> {
    return this.searchAndPaginate(params);
  }

  /**
   * Get all members without pagination (for internal use)
   */
  async getAllMembers(): Promise<Member[]> {
    const response = await apiClient.get(`${this.baseUrl}/all`);
    return response as unknown as Member[];
  }

  /**
   * Get member by ID
   */
  async getMemberById(id: string): Promise<Member> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Get members by user ID
   */
  async getMembersByUser(userId: string): Promise<Member[]> {
    const response = await apiClient.get(`${this.baseUrl}/user/${userId}`);
    return response as unknown as Member[];
  }

  /**
   * Get members by company ID
   */
  async getMembersByCompany(companyId: string): Promise<Member[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/company/${companyId}`
    );
    return response as unknown as Member[];
  }

  /**
   * Create a new member
   */
  async createMember(memberData: CreateMemberData): Promise<Member> {
    const response = await apiClient.post(this.baseUrl, memberData);
    return response.data;
  }

  /**
   * Update an existing member
   */
  async updateMember(
    id: string,
    memberData: UpdateMemberData
  ): Promise<Member> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}`, memberData);
    return response.data;
  }

  /**
   * Delete a member
   */
  async deleteMember(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Search members by text
   */
  async searchMembers(
    searchTerm: string,
    page: number = 1,
    limit: number = 20
  ): Promise<MemberApiResponse> {
    return this.searchAndPaginate({
      page,
      limit,
      search: searchTerm,
    });
  }

  /**
   * Get members by type (corporate, individual, student)
   */
  async getMembersByType(
    type: "corporate" | "individual" | "student",
    page: number = 1,
    limit: number = 20
  ): Promise<MemberApiResponse> {
    return this.searchAndPaginate({
      page,
      limit,
      status: type, // Assuming status field is used for membership type filter
    });
  }

  /**
   * Get recent members (most recently joined)
   */
  async getRecentMembers(limit: number = 5): Promise<Member[]> {
    const response = await this.getMembers({ page: 1, limit });
    return response.data.items;
  }
}

// Export a singleton instance
export const memberService = new MemberService();

// Export the class for backward compatibility
export { MemberService };

// Export default as the service instance
export default memberService;
