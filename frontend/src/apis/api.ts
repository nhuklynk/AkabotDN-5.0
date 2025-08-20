import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AppStore } from "@/lib/store";
import { logout, loginSuccess } from "@/features";
import { jwtDecode } from "jwt-decode";
import {
  AuthTokenPayload,
  mapTokenPayloadToUser,
} from "../interfaces/AuthTokenPayload";
import { RetryAxiosRequestConfig } from "../interfaces/RetryAxiosRequestConfig";

let store: AppStore;
export const injectStore = (_store: AppStore) => {
  store = _store;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (store) {
      const token = store.getState().auth.token;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/api/v1/auth/refresh", {});
        const newAccessToken = data.accessToken;

        const decodedUser = jwtDecode<AuthTokenPayload>(newAccessToken);
        const user = mapTokenPayloadToUser(decodedUser);

        store.dispatch(loginSuccess({ user, token: newAccessToken }));

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        console.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api };
