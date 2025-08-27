"use client";

import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import login, { LoginPayload, LoginResponse } from "@/services/auth/login";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/features/auth/authSlice";

export function useLogin() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => login(payload),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
              if (!data || !data.success || !data.data || !data.data.access_token || !data.data.user) {
          throw new Error('Invalid response from server');
        }
        
        dispatch(
          loginSuccess({
            user: {
              id: data.data.user.id,
              email: data.data.user.email,
              full_name: data.data.user.username,
              role: data.data.user.role,
            } as any,
            token: data.data.access_token,
          })
        );

      // Invalidate and refetch profile to get the latest user data and roles
      queryClient.invalidateQueries({ queryKey: ["auth-profile"] });
    },
    onError: (err) => {
      dispatch(loginFailure(err.message || "Login failed"));
    },
  });

  const mutate = useCallback(
    (payload: LoginPayload) => mutation.mutateAsync(payload),
    [mutation]
  );

  return { mutate, loading: mutation.isPending, error: mutation.error?.message ?? null };
}

export default useLogin;


