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
    email: string;
    //currentLoginInformations?: CurrentLoginInformations;
}