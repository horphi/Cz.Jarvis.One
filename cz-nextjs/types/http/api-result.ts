export interface ApiResult<T> {
  success: boolean;
  message?: string;
  code?: number;
  error?: string;
  data?: T;
}
