import { NextResponse, NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { ApiResult } from "@/types/http/api-result";
import { CHANGE_PASSWORD } from "@/config/endpoint";

export async function POST(req: NextRequest) {
  const logIdentifier = "ChangePassword";
  const apiResult: ApiResult<void> = {
    success: false,
  };
  console.log(`${logIdentifier} API called`);

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
      currentPassword: requestBody.currentPassword,
      newPassword: requestBody.newPassword,
    };
    console.log("Request Payload:", requestPayload);

    // Make the Remote API request
    const response = await fetch(`${CHANGE_PASSWORD}`, {
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
      let errorMessage =
        "Your Request could not be processed. Please try again.";
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
        apiResult.message = errorMessage;
        apiResult.error = responseData.error?.details || "";
      }
      return NextResponse.json(apiResult, { status: response.status });
    }

    // Return the API result
    apiResult.success = response.status === 200;
    // Return the Result Data
    //apiResult.data = responseData.result;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error(`${logIdentifier}: `, error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
