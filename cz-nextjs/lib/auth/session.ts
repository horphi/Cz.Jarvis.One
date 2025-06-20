import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { AuthSessionData } from "@/types/sessions/auth-session";

/**
 * Decodes a JWT token without using external libraries
 * @param token The JWT token string to decode
 * @returns The decoded payload as an object or null if invalid
 */
export function decodeJwtToken(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

/**
 * Normalizes the role claim which can be either a string or an array of strings
 * @param roleClaim The role claim from the JWT token
 * @returns A normalized array of role strings
 */
function normalizeRoleClaim(
  roleClaim: string | string[] | undefined
): string[] {
  if (!roleClaim) {
    return [];
  }

  // If it's already an array, return it
  if (Array.isArray(roleClaim)) {
    return roleClaim;
  }

  // If it's a string, wrap it in an array
  return [roleClaim];
}

/**
 * Extracts user information from a JWT token and returns session data
 * @param token The JWT access token
 * @param refreshToken The refresh token (if available)
 * @returns AuthSessionData with populated values
 */
export function extractSessionDataFromToken(
  token: string,
  refreshToken: string = ""
): AuthSessionData {
  const decoded = decodeJwtToken(token);

  console.log("Decoded JWT:", decoded);

  if (!decoded) {
    throw new Error("Invalid token format");
  } // Get the role claim and normalize it
  const roleClaim = decoded[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ] as string | string[] | undefined;
  console.log("🔍 extractSessionDataFromToken - Raw role claim:", roleClaim);
  const normalizedRoles = normalizeRoleClaim(roleClaim);
  console.log(
    "🔍 extractSessionDataFromToken - Normalized roles:",
    normalizedRoles
  );

  // Extract user info from token claims
  return {
    userId:
      typeof decoded.sub === "string"
        ? decoded.sub
        : typeof decoded.user_identifier === "string"
        ? decoded.user_identifier
        : "",
    userName:
      typeof decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ] === "string"
        ? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        : "",
    userRole: normalizedRoles,
    isLoggedIn: true,
    accessToken: token,
    refreshToken: refreshToken,
    firstName: typeof decoded.first_name === "string" ? decoded.first_name : "",
    lastName: typeof decoded.last_name === "string" ? decoded.last_name : "",
    email:
      typeof decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] === "string"
        ? decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
          ]
        : "",
  };
}

export const authSessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long",
  cookieName: "cz_jarvis_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Set to true in production
    maxAge: 60 * 60 * 24 * 7, // 1 week
    //sameSite: 'lax', // CSRF protection
    //httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
};

export async function getAuthSession() {
  return getIronSession<AuthSessionData>(await cookies(), authSessionOptions);
}
