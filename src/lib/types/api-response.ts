export type PaginationMetadata = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  filters?: Record<string, any>;
};

export interface APIResponse<T, M = undefined> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  metadata?: M;
  timestamp: string;
}

export interface APIErrorResponse {
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
} 