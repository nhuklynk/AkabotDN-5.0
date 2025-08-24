export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: string[] | null;
  timestamp: string;
  path: string;
}

export interface PaginatedApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors: string[] | null;
  timestamp: string;
  path: string;
}

export interface PaginatedData<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
