"use client";

import axios from "axios";

export const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://54.179.191.75:8000/api";

export const sseApiUrl = process.env.NEXT_PUBLIC_API_SSE_BASE_URL || apiUrl;

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth event handlers that embedders can register (e.g., chat-widget)
export type ApiAuthHandlers = {
  onUnauthorized?: (request?: any, error?: any) => boolean | void;
  onSessionExpired?: () => void;
};

let authHandlers: ApiAuthHandlers = {};

export function setApiAuthHandlers(handlers: Partial<ApiAuthHandlers>) {
  authHandlers = { ...authHandlers, ...handlers };
}

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: apiUrl,
        withCredentials: true,
      }
    );
    onRefreshed();
  } catch (error) {
    console.error("Refresh token expired or invalid", error);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    localStorage.setItem("last_request_success", new Date().toISOString());
    return response.data; // Return response.data so useLogin can access it directly
  },
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;

    // Don't retry for auth endpoints to avoid infinite loops
    if (originalRequest.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (originalRequest.params?.__x_no_retry__) {
      return Promise.reject(error);
    }

    if (is401) {
      try {
        const handled = authHandlers.onUnauthorized?.(originalRequest, error);
        if (handled) {
          return Promise.reject(error);
        }
      } catch (ignored) {
        // Ignore error
      }
    }

    if (is401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();

        await new Promise((resolve) => setTimeout(resolve, 100));

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Only logout if refresh token fails
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    if (is401 && originalRequest._retry) {
      // Don't auto logout on second 401, let the component handle it
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export async function handleLogout(url?: string) {
  try {
    localStorage.removeItem("last_request_success");
    await axios.post(
      `/auth/logout?redirect=${url ? encodeURIComponent(url) : ""}`,
      {},
      {
        baseURL: apiUrl,
        withCredentials: true,
      }
    );
  } catch (error) {
    // console.log(error);
  }

  if (typeof window !== "undefined" && window.self !== window.top) {
    try {
      authHandlers.onSessionExpired?.();
    } catch (ignored) {
      // console.log(ignored);
    }
    return;
  }

  const redirectUrl = window.location.href;
  window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default apiClient;
