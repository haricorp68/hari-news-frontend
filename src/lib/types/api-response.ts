export interface APIResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  metadata: string;
  timestamp: string;
}

export interface APIErrorResponse {
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
} 