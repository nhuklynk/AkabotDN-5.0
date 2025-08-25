import apiClient from "@/services/apiClient";

export type UserQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type UserListItem = {
  id: number | string;
  full_name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: string; // active/inactive
  created_at: string;
};

export type GetAllUserResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
};

export async function getAllUser(query: UserQuery = {}): Promise<GetAllUserResponse> {
  const params = { ...query } as Record<string, any>;
  return apiClient.get("/users", { params });
}

export default getAllUser;
