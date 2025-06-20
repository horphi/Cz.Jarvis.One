import { NextRequest, NextResponse } from "next/server";
import { GET_ENTITY_CHANGES } from "@/config/endpoint";
import { ApiResult } from "@/types/http/api-result";
import { getAuthSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const logIdentifier = "GetAllAuditLogs";

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

    const requestBody = await request.json();
    const { id } = requestBody;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Entity change ID is required" },
        { status: 400 }
      );
    }

    // Get entity changes with filter by ID
    // Since there might not be a dedicated endpoint for single entity change,
    // we'll fetch with a filter and get the first result
    const response = await fetch(GET_ENTITY_CHANGES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        maxResultCount: 1,
        skipCount: 0,
        filter: id, // Use ID as filter
        // Alternative: you might need to add specific filtering if the API supports it
        // entityChangeId: id
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch entity change" },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Find the entity change with matching ID
    const items = data?.data?.items || data?.items || [];
    const entityChange = items.find(
      (item: { id: number | string }) => item.id.toString() === id.toString()
    );

    if (!entityChange) {
      return NextResponse.json(
        { success: false, message: "Entity change not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entityChange,
    });
  } catch (error) {
    console.error("Error fetching entity change:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
