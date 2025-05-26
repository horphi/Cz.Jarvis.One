import { CREATE_OR_UPDATE_ROLE } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/lib/utils/api-response";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const requestBody = await req.json();

    const role = {
      id: requestBody.id || null, // Use null if id is not provided (New role)
      displayName: requestBody.roleName,
      isDefault: requestBody.isDefault,
    };

    const payload = {
      role: role,
      grantedPermissionNames: requestBody.permissions,
    };

    const response = await fetch(`${CREATE_OR_UPDATE_ROLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

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
