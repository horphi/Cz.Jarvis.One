import { NextRequest, NextResponse } from "next/server";
import { GET_ENTITY_CHANGES } from "@/config/endpoint";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const response = await fetch(GET_ENTITY_CHANGES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") || "",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch entity changes" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching entity changes:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
