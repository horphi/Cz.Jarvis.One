import { GET_USERS } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { NextResponse, NextRequest } from "next/server";

// payload Structure
// {
//   "maxResultCount": 1000,
//   "skipCount": 2147483647,
//   "sorting": "string",
//   "filter": "string",
//   "permissions": [
//     "string"
//   ],
//   "role": 0,
//   "onlyLockedUsers": true
// }

export async function POST(req: NextRequest) {
  try {
    // Check if the request is authenticated
    const session = await getAuthSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const requestBody = await req.json();
    // Expecting { requestBody } from the client
    const payload = requestBody.requestBody || {};

    const requestPayload = {
      maxResultCount: payload.maxResultCount || 1000,
      skipCount: payload.skipCount || 0,
      sorting: payload.sorting || "id asc",
      filter: payload.filter || "",
      permissions: payload.permissions || [],
      role: payload.role || null,
      onlyLockedUsers: payload.onlyLockedUsers || false,
    };

    const response = await fetch(`${GET_USERS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const responseData = await response.json();
    console.log("Response Data:", responseData);
    if (!response.ok) {
      //const errorData = await response.json();
      console.error("Error response body:", responseData);

      let errorMessage = "Failed to fetch roles. Please try again.";

      if (responseData && responseData.unAuthorizedReqeuest) {
        errorMessage = responseData.unAuthorizedReqeuest;
      } else {
        if (responseData.error?.message) {
          errorMessage = responseData.error.message;
        } else if (response.status === 400) {
          errorMessage = "Invalid request. Please check your input.";
        } else if (response.status === 401) {
          errorMessage = "Unauthorized access.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      );
    }

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
