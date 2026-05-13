import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { authStore, clearSession, setSession, getAccessToken } from "./auth";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach Bearer token to every request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// 401 → refresh once, retry, otherwise log out

let refreshing: Promise<string | null> | null = null;

const tryRefresh = async (): Promise<string | null> => {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const res = await axios.post<{
        success: boolean;
        data: { accessToken: string };
      }>(`${BASE_URL}/api/auth/refresh-token`, {}, { withCredentials: true });
      const newToken = res.data?.data?.accessToken;
      if (!newToken) return null;
      const current = authStore.get();
      if (current.user) {
        setSession(current.user, newToken);
        return newToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !original.url?.includes("/api/auth/")
    ) {
      original._retried = true;
      const newToken = await tryRefresh();
      if (newToken) {
        original.headers?.set("Authorization", `Bearer ${newToken}`);
        return api.request(original);
      }
      clearSession();
    }

    return Promise.reject(error);
  },
);

// Helper for response shape

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const errorMessage = (
  err: unknown,
  fallback = "Something went wrong",
): string => {
  if (axios.isAxiosError(err)) {
    const msg = (err.response?.data as { message?: string } | undefined)
      ?.message;
    if (msg) return msg;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};
