import { GET_ALL_AUDIT_LOGS } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { TAuditLog } from "@/types/audit-log/audit-log-type";
import { ApiResult } from "@/types/http/api-result";
import { NextResponse, NextRequest } from "next/server";

interface IGetAuditLogsRequest {
  startDate?: string; // Optional in request, but will be defaulted
  endDate?: string; // Optional in request, but will be defaulted
  userName?: string;
  serviceName?: string;
  methodName?: string;
  browserInfo?: string;
  hasException?: boolean;
  minExecutionDuration?: number; // in milliseconds
  maxExecutionDuration?: number; // in milliseconds
  maxResultCount?: number;
  skipCount?: number;
  sorting?: string;
}

export async function POST(req: NextRequest) {
  const logIdentifier = "GetAllAuditLogs";

  const apiResult: ApiResult<TAuditLog> = {
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
    const requestData: IGetAuditLogsRequest = await req.json();

    // Default to today's date range if not provided
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

    const startDate = requestData.startDate || startOfDay.toISOString();
    const endDate = requestData.endDate || endOfDay.toISOString();

    // Build query parameters
    const queryParams = new URLSearchParams();

    // startDate and endDate are always required
    queryParams.append("startDate", startDate);
    queryParams.append("endDate", endDate);
    if (requestData.userName)
      queryParams.append("userName", requestData.userName);
    if (requestData.serviceName)
      queryParams.append("serviceName", requestData.serviceName);
    if (requestData.methodName)
      queryParams.append("methodName", requestData.methodName);
    if (requestData.browserInfo)
      queryParams.append("browserInfo", requestData.browserInfo);
    if (requestData.hasException !== undefined)
      queryParams.append("hasException", requestData.hasException.toString());
    if (requestData.minExecutionDuration !== undefined)
      queryParams.append(
        "minExecutionDuration",
        requestData.minExecutionDuration.toString()
      );
    if (requestData.maxExecutionDuration !== undefined)
      queryParams.append(
        "maxExecutionDuration",
        requestData.maxExecutionDuration.toString()
      );
    if (requestData.maxResultCount !== undefined)
      queryParams.append(
        "maxResultCount",
        requestData.maxResultCount.toString()
      );
    if (requestData.skipCount !== undefined)
      queryParams.append("skipCount", requestData.skipCount.toString());
    if (requestData.sorting) queryParams.append("sorting", requestData.sorting);

    // Construct the full URL with query parameters
    const apiUrl = `${GET_ALL_AUDIT_LOGS}?${queryParams.toString()}`;

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
    apiResult.data = responseData.result.items;
    return NextResponse.json(apiResult, { status: response.status });
  } catch (error) {
    console.error(`${logIdentifier}: `, error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
