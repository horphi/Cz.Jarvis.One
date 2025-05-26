import { NextResponse } from "next/server";
import { ApiResult } from "@/types/http/api-result";

interface ApiErrorResponseOptions {
  message: string;
  code?: number;
  error?: string;
  status: number;
}

/**
 * Creates a standardized API error response using ApiResult<T>.
 * @param options - Error response options
 * @returns NextResponse with ApiResult<null>
 */
export function createApiErrorResponse({
  message,
  code,
  error,
  status,
}: ApiErrorResponseOptions) {
  const result: ApiResult<null> = {
    success: false,
    message,
    code,
    error,
    data: null,
  };
  return NextResponse.json(result, { status });
}

export function createApiResponse<T>({
  data,
  message,
}: {
  data: T;
  message?: string;
}) {
  const result: ApiResult<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return NextResponse.json(result);
}
