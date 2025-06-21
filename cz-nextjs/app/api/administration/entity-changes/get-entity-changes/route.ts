import { NextRequest, NextResponse } from "next/server";
import { GET_ENTITY_CHANGES } from "@/config/endpoint";
import { TEntityChange } from "@/types/audit-log/entity-change-type";
import { ApiResult } from "@/types/http/api-result";
import { getAuthSession } from "@/lib/auth/session";

interface IGetEntityChangesRequest {
  startDate?: string; // Optional in request, but will be defaulted
  endDate?: string; // Optional in request, but will be defaulted
  userName?: string;
  entityTypeFullName?: string;
  changeType?: number;
  sorting?: string;
  maxResultCount?: number;
  skipCount?: number;
}

export async function POST(request: NextRequest) {
  const logIdentifier = "GetEntityChagnes";

  const apiResult: ApiResult<TEntityChange> = {
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

    // Parse request body to get parameters
    const requestBody = await request.json();

    // Create query parameters from request data
    const queryParams = createQueryParams(requestBody);

    // Construct the full URL with query parameters
    const apiUrl = `${GET_ENTITY_CHANGES}?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const responseData = await response.json();

    console.log(`${logIdentifier} API Response: `, responseData);

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
    apiResult.data = responseData.result;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error(`${logIdentifier}: `, error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

function createQueryParams(
  requestBody: IGetEntityChangesRequest
): URLSearchParams {
  const queryParams = new URLSearchParams();

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  // Set default values for startDate and endDate if not provided
  const startDate = requestBody.startDate || startOfDay.toISOString();
  const endDate = requestBody.endDate || endOfDay.toISOString();
  // startDate and endDate are always required
  queryParams.set("startDate", startDate);
  queryParams.set("endDate", endDate);

  if (requestBody.userName) {
    queryParams.set("userName", requestBody.userName);
  }
  if (requestBody.entityTypeFullName) {
    queryParams.set("entityTypeFullName", requestBody.entityTypeFullName);
  }

  if (requestBody.changeType !== undefined) {
    queryParams.set("changeType", requestBody.changeType.toString());
  }

  if (requestBody.sorting) {
    queryParams.set("sorting", requestBody.sorting);
  }

  if (requestBody.maxResultCount) {
    queryParams.set("maxResultCount", requestBody.maxResultCount.toString());
  }

  if (requestBody.skipCount) {
    queryParams.set("skipCount", requestBody.skipCount.toString());
  }

  return queryParams;
}
