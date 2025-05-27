import { GET_USER_FOR_EDIT } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { createApiErrorResponse } from "@/lib/utils/api-response";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    // // Ensure Permissions field is included
    // const permissions = {
    //   Permissions: requestBody.Permissions || [],
    // };

    // console.log("Final request body for GET_ROLES:", permissions);

    const session = await getAuthSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    // Construct the URL with the role ID for editing
    const url = `${GET_USER_FOR_EDIT}?Id=${requestBody.id}`;
    // Make the API request to get the role for editing
    const response = await fetch(`${url}`, {
      method: "GET",
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
    return NextResponse.json({
      success: true,
      data: responseData.result,
    });
  } catch (error) {
    console.error("Get Roles error:", error);
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
