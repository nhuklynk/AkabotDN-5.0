import apiClient from "../apiClient";

// Company types based on backend DTOs
export interface CreateCompanyData {
  name: string;
  tax_number: string;
  email: string;
  phone_number: string;
  business_registration_form_url?: string;
}

export interface UpdateCompanyData {
  name?: string;
  tax_number?: string;
  email?: string;
  phone_number?: string;
  business_registration_form_url?: string;
}

export interface Company {
  id: string;
  name: string;
  tax_number: string;
  email: string;
  phone_number: string;
  business_registration_form_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyWithMembers extends Company {
  members: any[]; // Define member type if needed
}

class CompanyService {
  private readonly baseUrl = "/companies";

  /**
   * Create a new company
   */
  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    const response = await apiClient.post(this.baseUrl, companyData);
    return response.data;
  }

  /**
   * Get all companies
   */
  async getAllCompanies(): Promise<Company[]> {
    const response = await apiClient.get(this.baseUrl);
    return response as unknown as Company[];
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<CompanyWithMembers> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update an existing company
   */
  async updateCompany(
    id: string,
    companyData: UpdateCompanyData
  ): Promise<Company> {
    const response = await apiClient.patch(
      `${this.baseUrl}/${id}`,
      companyData
    );
    return response.data;
  }

  /**
   * Delete a company
   */
  async deleteCompany(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Search companies by name
   */
  async searchCompaniesByName(searchTerm: string): Promise<Company[]> {
    const companies = await this.getAllCompanies();
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Check if company exists by tax number
   */
  async checkCompanyByTaxNumber(taxNumber: string): Promise<Company | null> {
    try {
      const companies = await this.getAllCompanies();
      return (
        companies.find((company) => company.tax_number === taxNumber) || null
      );
    } catch (error) {
      console.error("Error checking company by tax number:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const companyService = new CompanyService();

// Export the class for backward compatibility
export { CompanyService };

// Export default as the service instance
export default companyService;
