import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import {
  IMPERSONATE_USER,
  IMPERSONATED_AUTHENTICATION,
} from "@/config/endpoint";
import { extractSessionDataFromToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const session = await getAuthSession();

    // Check if user is logged in and has admin privileges
    if (!session || !session.isLoggedIn || !session.accessToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin role for impersonation
    if (
      !session.userRole?.some((role) =>
        ["admin", "administrator"].includes(role.toLowerCase())
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin privileges required for impersonation",
        },
        { status: 403 }
      );
    }

    // Call the impersonate user API
    const impersonateResponse = await fetch(IMPERSONATE_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!impersonateResponse.ok) {
      const errorData = await impersonateResponse.json();
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || "Impersonation failed",
        },
        { status: impersonateResponse.status }
      );
    }

    const impersonateData = await impersonateResponse.json();

    if (
      !impersonateData.success ||
      !impersonateData.result?.impersonationToken
    ) {
      return NextResponse.json(
        { success: false, error: "Failed to get impersonation token" },
        { status: 400 }
      );
    }

    const impersonationToken = impersonateData.result.impersonationToken;

    // Get impersonated authentication token
    const authResponse = await fetch(
      `${IMPERSONATED_AUTHENTICATION}${impersonationToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error?.message ||
            "Failed to authenticate as impersonated user",
        },
        { status: authResponse.status }
      );
    }

    const authData = await authResponse.json();

    if (!authData.success || !authData.result?.accessToken) {
      return NextResponse.json(
        { success: false, error: "Failed to get impersonated access token" },
        { status: 400 }
      );
    }

    // Extract session data from the impersonated token
    const impersonatedSessionData = extractSessionDataFromToken(
      authData.result.accessToken,
      authData.result.refreshToken || ""
    ); // Store original session data and update with impersonated data
    console.log("🔍 Start Impersonation - Storing original user data:", {
      userId: session.userId,
      userName: session.userName,
      userRole: session.userRole,
    });

    session.isImpersonating = true;
    session.impersonationToken = impersonationToken;
    session.originalUserId = session.userId;
    session.originalUserName = session.userName;
    session.originalAccessToken = session.accessToken;
    // Store original user roles as backup
    session.originalUserRole = session.userRole;

    // Update with impersonated user data
    session.userId = impersonatedSessionData.userId;
    session.userName = impersonatedSessionData.userName;
    session.accessToken = impersonatedSessionData.accessToken;
    session.refreshToken = impersonatedSessionData.refreshToken;
    session.userRole = impersonatedSessionData.userRole;
    session.firstName = impersonatedSessionData.firstName;
    session.lastName = impersonatedSessionData.lastName;
    session.email = impersonatedSessionData.email;

    await session.save();

    return NextResponse.json({
      success: true,
      message: `Successfully impersonating user: ${impersonatedSessionData.userName}`,
      impersonatedUser: {
        userId: impersonatedSessionData.userId,
        userName: impersonatedSessionData.userName,
        firstName: impersonatedSessionData.firstName,
        lastName: impersonatedSessionData.lastName,
        email: impersonatedSessionData.email,
      },
    });
  } catch (error) {
    console.error("Impersonation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during impersonation",
      },
      { status: 500 }
    );
  }
}
