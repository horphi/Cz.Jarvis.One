import { DELETE_ROLE } from "@/config/endpoint";
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
    const url = `${DELETE_ROLE}?Id=${requestBody.roleId}`;
    const response = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log("Response from CREATE_OR_UPDATE_ROLE:", response);
    const data = await response.json();

    // Handle error responses from API
    if (!response.ok || (data && data.success === false)) {
      // 401 Unauthorized or 403 Forbidden
      if (data?.unAuthorizedRequest) {
        return createApiErrorResponse({
          message: data?.error?.message || "Unauthorized or forbidden.",
          error: data?.error?.message,
          status:
            response.status === 401 || response.status === 403
              ? response.status
              : 403,
        });
      }
      // 500 or other errors (e.g., duplicate role name)
      if (data?.error?.message) {
        return createApiErrorResponse({
          message: data.error.message,
          error: data.error.message,
          status: response.status,
        });
      }
      // Fallback for unknown errors
      return createApiErrorResponse({
        message: "An unknown error occurred.",
        error: data?.error?.message,
        status: response.status,
      });
    }
    // Handle success response
    return createApiResponse({
      data: data.result,
    });
  } catch (error) {
    console.error("Get Roles error:", error);
    return createApiErrorResponse({
      message: "An unexpected error occurred. Please try again.",
      status: 500,
    });

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
