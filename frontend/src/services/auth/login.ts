import apiClient from "@/services/apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
  errors: any;
  timestamp: string;
  path: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiClient.post("/auth/login", payload, { withCredentials: true });
}

export default login;
