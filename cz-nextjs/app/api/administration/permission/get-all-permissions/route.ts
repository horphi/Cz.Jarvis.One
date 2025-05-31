import { GET_ALL_PERMISSIONS } from "@/config/endpoint";
import { ApiResult } from "@/types/http/api-result";
import { IPermission } from "@/types/roles/i-permission";
import { NextResponse } from "next/server";

export async function POST() {
  const logIdentifier = "GetAllPermissions";

  const apiResult: ApiResult<IPermission> = {
    success: false,
  };
  console.log(`${logIdentifier} API called`);

  try {
    const response = await fetch(`${GET_ALL_PERMISSIONS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

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
    }

    // Return the API result
    apiResult.success = response.status === 200;
    // Return the Result Data
    apiResult.data = responseData.result.items;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error(`${logIdentifier}: `, error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

// return NextResponse.json({
//       success: true,
//       data: data.result.items,
//     });

//   "items": [
//     {
//       "level": 0,
//       "parentName": "string",
//       "name": "string",
//       "displayName": "string",
//       "description": "string",
//       "isGrantedByDefault": true
//     }
//   ]
// }
