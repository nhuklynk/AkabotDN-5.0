import apiClient from "@/services/apiClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
};

// POST /auth/login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  // withCredentials to receive httpOnly cookies from backend
  return apiClient.post("/auth/login", payload, { withCredentials: true });
}

export default login;


