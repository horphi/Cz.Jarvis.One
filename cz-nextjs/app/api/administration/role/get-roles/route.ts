import { GET_ROLES } from "@/config/endpoint";
import { getAuthSession } from "@/lib/auth/session";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    // Ensure Permissions field is included
    const permissions = {
      Permissions: requestBody.Permissions || [],
    };

    const session = await getAuthSession();
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${GET_ROLES}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(permissions),
    });

    const responseData = await response.json();

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
