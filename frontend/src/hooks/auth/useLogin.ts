"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import login, { LoginPayload, LoginResponse } from "@/services/auth/login";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "@/features/auth/authSlice";

export function useLogin() {
  const dispatch = useDispatch();

  const mutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload) => login(payload),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          user: {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.username,
            role: data.user.role,
          } as any,
          token: data.access_token,
        })
      );
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


