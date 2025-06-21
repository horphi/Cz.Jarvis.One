import { NextRequest, NextResponse } from "next/server";
import { GET_ENTITY_PROPERTY_CHANGES } from "@/config/endpoint";
import { TEntityPropertyChange } from "@/types/audit-log/entity-property-changes-type";
import { ApiResult } from "@/types/http/api-result";
import { getAuthSession } from "@/lib/auth/session";

interface IGetEntityPropertyChangesRequest {
  entityChangeId: string;
}

export async function POST(req: NextRequest) {
  const logIdentifier = "GetEntityPropertyChanges";

  const apiResult: ApiResult<TEntityPropertyChange> = {
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
    const requestBody: IGetEntityPropertyChangesRequest = await req.json();

    console.log(`${logIdentifier} Request Body: `);

    //?entityChangeId=123
    const apiUrl = `${GET_ENTITY_PROPERTY_CHANGES}?entityChangeId=${requestBody.entityChangeId.toString()}`;

    console.log(`${logIdentifier} API URL: `, apiUrl);

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
