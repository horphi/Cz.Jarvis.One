import { GET_ALL_PERMISSIONS } from "@/config/endpoint";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(`${GET_ALL_PERMISSIONS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response body:", errorData);

      let errorMessage = "Failed to fetch permissions. Please try again.";

      if (errorData && errorData.unAuthorizedReqeuest) {
        errorMessage = errorData.unAuthorizedReqeuest;
      } else {
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
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

    console.log("Response:", data.result.items);

    return NextResponse.json({
      success: true,
      data: data.result.items,
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
