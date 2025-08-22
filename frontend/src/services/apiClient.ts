import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Simple retry counter on request config
declare module "axios" {
	interface AxiosRequestConfig {
		_retryCount?: number;
	}
	interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig {
		_retryCount?: number;
	}
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const LOGIN_PATH = "/login";

const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE,
	timeout: 10000,
});

const getToken = (): string | null => {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem("token");
	} catch {
		return null;
	}
};

const setToken = (token: string): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem("token", token);
	} catch {
		// ignore
	}
};

// Attach JSON headers and Authorization token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	const headers = (config.headers ?? {}) as any;
	if (!("Accept" in headers)) headers["Accept"] = "application/json";
	if (!("Content-Type" in headers) && !(config.data instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}
	// Do not attach token for refresh endpoint
	const isRefresh = typeof config.url === "string" && config.url.includes("/auth/refresh");
	if (!isRefresh) {
		const token = getToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}
	config.headers = headers;
	return config;
});

// Helper: refresh access token (assuming cookie-based refresh or server returns new token)
const refreshAccessToken = async (): Promise<string> => {
	const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
	const newToken: string | undefined = res.data?.accessToken || res.data?.token;
	if (!newToken) throw new Error("No access token in refresh response");
	setToken(newToken);
	return newToken;
};

apiClient.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	async (error: AxiosError) => {
		const status = error.response?.status;
		const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

		if (status === 401 && originalRequest) {
			originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
			if (originalRequest._retryCount <= 3) {
				try {
					const newToken = await refreshAccessToken();
					const h = (originalRequest.headers ?? {}) as any;
					h["Authorization"] = `Bearer ${newToken}`;
					originalRequest.headers = h;
					return apiClient(originalRequest);
				} catch {
					if (typeof window !== "undefined") window.location.href = LOGIN_PATH;
					return Promise.reject(error);
				}
			}
			// exceeded retry attempts
			if (typeof window !== "undefined") window.location.href = LOGIN_PATH;
		}
		return Promise.reject(error);
	}
);

export default apiClient;