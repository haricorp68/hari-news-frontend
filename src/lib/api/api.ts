import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { APIResponse } from "../types/api-response";
import { toast } from "sonner";

// Extend AxiosRequestConfig to support disableToast
declare module "axios" {
  export interface AxiosRequestConfig {
    disableToast?: boolean;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Đảm bảo gửi cookie http-only
});

// Request interceptor (không cần xử lý token vì dùng cookie http-only)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi toàn cục
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Lấy config từ error
    const config = error.config || {};
    // Kiểm tra xem có phải lỗi chưa đăng nhập không (ví dụ: HTTP 401)
    const isUnauthorizedError = error.response && error.response.status === 401;

    // Nếu không phải là lỗi chưa đăng nhập VÀ không có disableToast thì mới hiển thị toast
    if (
      !config.disableToast &&
      !isUnauthorizedError &&
      error.response &&
      error.response.data
    ) {
      const errData = error.response.data as { message?: string | string[] };
      // Hiển thị thông báo lỗi bằng toast của shadcn sonner
      if (typeof window !== "undefined" && errData.message) {
        const msg = Array.isArray(errData.message)
          ? errData.message.join(", ")
          : errData.message;
        toast.error(msg);
      }
    }

    // Log lỗi ra console cho dev
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

// Hàm tiện ích cho các method
export const getApi = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => {
  const res = await api.get<APIResponse<T>>(url, config);
  return res.data;
};

export const postApi = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => {
  const res = await api.post<APIResponse<T>>(url, data, config);
  return res.data;
};

export const putApi = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => {
  const res = await api.put<APIResponse<T>>(url, data, config);
  return res.data;
};

export const patchApi = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => {
  const res = await api.patch<APIResponse<T>>(url, data, config);
  return res.data;
};

export const deleteApi = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => {
  const res = await api.delete<APIResponse<T>>(url, config);
  return res.data;
};

export default api;
