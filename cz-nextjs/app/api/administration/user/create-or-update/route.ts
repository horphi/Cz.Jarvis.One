import { CREATE_OR_UPDATE_USER } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { ApiResult } from "@/types/http/api-result";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiResult: ApiResult<void> = {
    success: false,
  };

  console.log("Create or Update User API called");

  try {
    const session = await getAuthSession();
    // Check if session and accessToken are available
    if (!session || !session.accessToken) {
      apiResult.message = "Authentication required";
      return NextResponse.json(apiResult, { status: 401 });
    }

    // Parse the request body
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
    console.log("Create or Update User Response:", responseData);
    // Return the API result
    apiResult.success = response.status === 200;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error("Get Roles error:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
