export interface User {
  id: string;
  email: string;
  full_name: string;
  // Add other user fields as needed
}

export interface Company {
  id: string;
  name: string;
  tax_number: string;
  email: string;
  phone_number: string;
}

export interface Member {
  id: string;
  membership_type: "corporate" | "individual" | "student";
  job_title: string;
  assistant_info?: string;
  membership_registration_form_url?: string;
  work_unit: string;
  expertise_level: "beginner" | "intermediate" | "advanced" | "expert";
  curriculum_vitae_url?: string;
  joined_at: string;
  user: User;
  company: Company | null;
}

export interface MemberApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: Member[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors: null;
  timestamp: string;
  path: string;
}

export interface MemberQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  company_id?: string;
  status?: string;
}
