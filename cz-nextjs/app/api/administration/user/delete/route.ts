import { DELETE_USER } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { ApiResult } from "@/types/http/api-result";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiResult: ApiResult<void> = {
    success: false,
  };

  console.log("Delete User API called");

  try {
    const session = await getAuthSession();
    // Check if session and accessToken are available
    if (!session || !session.accessToken) {
      apiResult.message = "Authentication required";
      return NextResponse.json(apiResult, { status: 401 });
    }

    // Parse the request body
    const requestBody = await req.json();

    // Construct the URL with the user ID to delete
    const url = `${DELETE_USER}?Id=${requestBody.userId}`;
    const response = await fetch(`${url}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const responseData = await response.json();

    // Handle error responses from API
    if (!response.ok) {
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
        apiResult.message = "Failed to fetch roles";
        apiResult.error = errorMessage;
      }
    }

    // Return the API result
    apiResult.success = response.status === 200;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error("Get Roles error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
