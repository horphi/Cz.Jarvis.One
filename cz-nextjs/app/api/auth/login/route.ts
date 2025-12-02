import { TOKEN_AUTH, GET_USER_CONFIGURATION } from "@/config/endpoint";
import {
  extractSessionDataFromToken,
  getAuthSession,
} from "@/lib/auth/session";
import { AbpUserConfigurationResponse } from "@/types/auth/user-configuration";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  console.log("Login attempt with username:", username);

  // call login function
  try {
    const requestBody = JSON.stringify({
      UsernameOrEmailAddress: username,
      Password: password,
    });

    const response = await fetch(TOKEN_AUTH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle error responses with specific messages for toast notifications
      let errorMessage = "Login failed. Please try again.";

      if (data.error?.message) {
        errorMessage = data.error.message;
      } else if (response.status === 400) {
        errorMessage = "Invalid request. Please check your input.";
      } else if (response.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        {
          status: response.status,
        }
      );
    }

    // Login successful, process the tokens
    console.log("Login successful for user:", username);

    // Get the current auth session
    const authSession = await getAuthSession();

    // Use our token decoder to extract user information
    const sessionData = extractSessionDataFromToken(
      data.result.accessToken,
      data.result.refreshToken
    );

    // Update all session fields
    authSession.userId = sessionData.userId;
    authSession.userName = sessionData.userName;
    authSession.userRole = sessionData.userRole;
    authSession.isLoggedIn = true;
    authSession.accessToken = sessionData.accessToken;
    authSession.refreshToken = data.result.refreshToken;
    authSession.firstName = sessionData.firstName;
    authSession.lastName = sessionData.lastName;
    authSession.email = sessionData.email;

    // Fetch user permissions from ABP and store in session
    try {
      const configResponse = await fetch(GET_USER_CONFIGURATION, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.result.accessToken}`,
        },
      });

      if (configResponse.ok) {
        const configData: AbpUserConfigurationResponse =
          await configResponse.json();
        if (configData.result?.auth?.grantedPermissions) {
          authSession.grantedPermissions =
            configData.result.auth.grantedPermissions;
          console.log(
            "✅ Permissions loaded:",
            Object.keys(configData.result.auth.grantedPermissions).length,
            "permissions"
          );
        }
      } else {
        console.warn("⚠️ Failed to fetch user permissions");
      }
    } catch (permissionError) {
      console.error("❌ Error fetching user permissions:", permissionError);
      // Continue login even if permissions fail - they can be fetched client-side
    }

    await authSession.save();

    // Return success response
    return NextResponse.json({
      success: true,
      userName: sessionData.userName,
      userRole: sessionData.userRole,
    });
  } catch (error) {
    console.error("Login error:", error);
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
