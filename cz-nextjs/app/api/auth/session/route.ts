import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { GET_CURRENT_LOGIN_INFORMATIONS } from "@/config/endpoint";
import { ApiResult } from "@/types/http/api-result";
import { TUserSession } from "@/types/users/user-type";

export async function POST() {
  const apiResult: ApiResult<TUserSession> = {
    success: false,
  };

  console.log("Get Current Login Information API called");

  try {
    const session = await getAuthSession();
    // Check if session and accessToken are available
    if (!session || !session.accessToken) {
      apiResult.message = "Authentication required";
      return NextResponse.json(apiResult, { status: 401 });
    }

    // Make the Remote API request to get current login information
    const response = await fetch(`${GET_CURRENT_LOGIN_INFORMATIONS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    console.log("Get Current Login Information Response:", responseData);
    // Return the API result
    apiResult.success = response.status === 200;
    apiResult.data = responseData.result;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error("Get Roles error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
