import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type { APIResponse } from "../types/api-response";
import { toast } from "sonner";

// Extend AxiosRequestConfig to support disableToast
declare module "axios" {
  export interface AxiosRequestConfig {
    disableToast?: boolean;
  }
}

const API_BASE_URL = "http://localhost:3000/api";

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
  (error) => {
    // Lấy config từ error
    const config = error.config || {};
    // Nếu có disableToast thì bỏ qua toast
    if (!config.disableToast && error.response && error.response.data) {
      const errData = error.response.data;
      // Có thể kiểm tra và xử lý tuỳ ý, ví dụ log, toast, redirect...
      if (typeof window !== "undefined") {
        // Hiển thị thông báo lỗi bằng toast của shadcn sonner
        if (errData.message) {
          const msg = Array.isArray(errData.message)
            ? errData.message.join(", ")
            : errData.message;
          toast.error(msg);
        }
      }
      // Có thể log lỗi ra console cho dev
      if (process.env.NODE_ENV !== "production") {
        console.error("API Error:", errData);
      }
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

export const deleteApi = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
) => {
  const res = await api.delete<APIResponse<T>>(url, config);
  return res.data;
};

export default api;
