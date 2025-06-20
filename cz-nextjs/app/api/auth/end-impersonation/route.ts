import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import {
  BACK_TO_IMPERSONATOR,
  IMPERSONATED_AUTHENTICATION,
} from "@/config/endpoint";
import { extractSessionDataFromToken } from "@/lib/auth/session";

export async function POST() {
  try {
    const session = await getAuthSession();

    // Check if user is logged in and currently impersonating
    if (!session || !session.isLoggedIn) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    if (
      !session.isImpersonating ||
      !session.impersonationToken ||
      !session.originalAccessToken
    ) {
      return NextResponse.json(
        { success: false, error: "No active impersonation session found" },
        { status: 400 }
      );
    }

    // Call back to impersonator API
    const backToImpersonatorResponse = await fetch(BACK_TO_IMPERSONATOR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Current impersonated token
      },
    });

    if (!backToImpersonatorResponse.ok) {
      const errorData = await backToImpersonatorResponse.json();
      console.error("Back to impersonator failed:", errorData);
      // Continue with local session restoration even if API call fails
    } // Get fresh token for the original user using impersonation token
    console.log(
      "🔍 End Impersonation - Calling IMPERSONATED_AUTHENTICATION with token:",
      session.impersonationToken
    );
    const authResponse = await fetch(
      `${IMPERSONATED_AUTHENTICATION}${session.impersonationToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "🔍 End Impersonation - IMPERSONATED_AUTHENTICATION response status:",
      authResponse.status
    );
    let originalSessionData;
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log(
        "🔍 End Impersonation - IMPERSONATED_AUTHENTICATION response data:",
        authData
      );

      if (authData.success && authData.result?.accessToken) {
        console.log(
          "✅ End Impersonation - Valid access token received, extracting session data"
        );
        // Extract session data from the fresh original user token
        originalSessionData = extractSessionDataFromToken(
          authData.result.accessToken,
          authData.result.refreshToken || ""
        );
        console.log(
          "🔍 End Impersonation - Extracted session data:",
          originalSessionData
        );
      } else {
        console.log(
          "❌ End Impersonation - Invalid response structure or missing access token"
        );
      }
    } else {
      console.log(
        "❌ End Impersonation - IMPERSONATED_AUTHENTICATION failed:",
        authResponse.status
      );
      const errorData = await authResponse.text();
      console.log("❌ End Impersonation - Error response:", errorData);
    } // Restore original session data
    const originalUserId = session.originalUserId;
    const originalUserName = session.originalUserName;

    console.log(
      "🔍 End Impersonation - Original session data received:",
      originalSessionData
    );
    console.log("🔍 End Impersonation - Original user ID:", originalUserId);
    console.log("🔍 End Impersonation - Original user name:", originalUserName);

    if (originalSessionData) {
      console.log("✅ End Impersonation - Using fresh token data");
      console.log(
        "🔍 End Impersonation - Restoring roles:",
        originalSessionData.userRole
      );

      // Use fresh token data
      session.userId = originalSessionData.userId;
      session.userName = originalSessionData.userName;
      session.accessToken = originalSessionData.accessToken;
      session.refreshToken = originalSessionData.refreshToken;
      session.userRole = originalSessionData.userRole;
      session.firstName = originalSessionData.firstName;
      session.lastName = originalSessionData.lastName;
      session.email = originalSessionData.email;
    } else {
      console.log("⚠️ End Impersonation - Using fallback stored data");
      console.log(
        "🔍 End Impersonation - Available fallback roles:",
        session.originalUserRole
      );

      // Fallback to stored original data
      session.userId = originalUserId || "";
      session.userName = originalUserName || "";
      session.accessToken = session.originalAccessToken || "";
      session.userRole = session.originalUserRole || []; // Use stored original roles

      console.log("🔍 End Impersonation - Restored session with fallback:", {
        userId: session.userId,
        userName: session.userName,
        userRole: session.userRole,
      });
      // Note: Other fields will need to be refreshed separately
    } // Clear impersonation data
    session.isImpersonating = false;
    session.impersonationToken = undefined;
    session.originalUserId = undefined;
    session.originalUserName = undefined;
    session.originalAccessToken = undefined;
    session.originalUserRole = undefined;

    console.log("🔍 End Impersonation - Final session before save:", {
      userId: session.userId,
      userName: session.userName,
      userRole: session.userRole,
      isImpersonating: session.isImpersonating,
      accessToken: session.accessToken ? "present" : "missing",
    });

    await session.save();

    console.log("✅ End Impersonation - Session saved successfully");

    return NextResponse.json({
      success: true,
      message: `Successfully returned to original user: ${originalUserName}`,
      originalUser: {
        userId: originalUserId,
        userName: originalUserName,
      },
    });
  } catch (error) {
    console.error("End impersonation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while ending impersonation",
      },
      { status: 500 }
    );
  }
}
