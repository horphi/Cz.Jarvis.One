//import { CurrentLoginInformations } from "./current-login-informations";

export interface AuthSessionData {
  userId: string;
  userName: string;
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  userRole: string[];
  firstName: string;
  lastName: string;
  email: string; // Impersonation fields
  isImpersonating?: boolean;
  impersonationToken?: string;
  originalUserId?: string;
  originalUserName?: string;
  originalAccessToken?: string;
  originalUserRole?: string[]; // Store original user's roles for fallback
  //currentLoginInformations?: CurrentLoginInformations;
}
