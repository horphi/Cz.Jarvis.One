export interface ApiResult<T> {
  success: boolean;
  message?: string; // message other than error
  code?: number; // error code, if any (for future use)
  error?: string; // error message
  data?: T;
}
