import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/features/auth/authSlice";
import apiClient from "@/services/apiClient";

interface LogoutResponse {
  message: string;
  success: boolean;
}

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (): Promise<LogoutResponse> => {
      const response = await apiClient.post<LogoutResponse>("/auth/logout");
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Logout successful:", data.message);

      // Clear Redux state
      dispatch(logoutAction());

      // Redirect to login page
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);

      dispatch(logoutAction());
      router.push("/login");
    },
  });
};
