import { CREATE_OR_UPDATE_USER } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import {
  createApiErrorResponse,
  createApiResponse,
} from "@/lib/utils/api-response";
import { NextRequest, NextResponse } from "next/server";

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

    // Construct the request payload
    const requestPayload = {
      user: {
        id: requestBody.id || null,
        name: requestBody.firstName,
        surname: requestBody.surName,
        userName: requestBody.userName,
        emailAddress: requestBody.emailAddress,
        phoneNumber: requestBody.phoneNumber,
        password: requestBody.password,
        isActive: requestBody.isActive,
        shouldChangePasswordOnNextLogin:
          requestBody.shouldChangePasswordOnNextLogin,
        isTwoFactorEnabled: requestBody.isTwoFactorEnabled,
        isLockoutEnabled: requestBody.isLockoutEnabled,
      },
      assignedRoleNames: requestBody.assignedRoleNames || [],
      sendActivationEmail: requestBody.sendActivationEmail,
      setRandomPassword: requestBody.setRandomPassword,
    };

    // Make the API request to create or update the user
    const response = await fetch(`${CREATE_OR_UPDATE_USER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(requestPayload),
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
