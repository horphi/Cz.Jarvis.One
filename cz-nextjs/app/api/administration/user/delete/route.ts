import { DELETE_USER } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/lib/utils/api-response";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    // Check if the session and access token are available
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    // Parse the incoming request body
    const requestBody = await req.json();
    const url = `${DELETE_USER}?Id=${requestBody.userId}`;
    const response = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const responseData = await response.json();

    // Handle error responses from API
    if (!response.ok || (responseData && responseData.success === false)) {
      // 401 Unauthorized or 403 Forbidden
      if (responseData?.unAuthorizedRequest) {
        return createApiErrorResponse({
          message: responseData?.error?.message || "Unauthorized or forbidden.",
          error: responseData?.error?.message,
          status:
            response.status === 401 || response.status === 403
              ? response.status
              : 403,
        });
      }
      // 500 or other errors (e.g., duplicate role name)
      if (responseData?.error?.message) {
        return createApiErrorResponse({
          message: responseData.error.message,
          error: responseData.error.message,
          status: response.status,
        });
      }
      // Fallback for unknown errors
      return createApiErrorResponse({
        message: "An unknown error occurred.",
        error: responseData?.error?.message,
        status: response.status,
      });
    }
    // Handle success response
    return createApiResponse({
      data: responseData.result,
    });
  } catch (error) {
    console.error("Get Roles error:", error);
    return createApiErrorResponse({
      message: "An unexpected error occurred. Please try again.",
      status: 500,
    });
  }
}
