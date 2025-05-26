
export interface User {
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
    profilePictureId: string | null;
    loginType: number;
    id: number;
}

export interface Application {
    version: string;
    releaseDate: string; // Consider using Date type if you parse it
    currency: string;
    currencySign: string;
    allowTenantsToChangeEmailSettings: boolean;
    userDelegationIsEnabled: boolean;
    twoFactorCodeExpireSeconds: number;
    passwordlessLoginCodeExpireSeconds: number;
    features: Record<string, unknown>; // Use a more specific type if the structure of features is known
}

export interface CurrentLoginInformations {
    user: User;
    impersonatorUser: unknown | null; // Use a specific type if known
    tenant: unknown | null; // Use a specific type if known
    impersonatorTenant: unknown | null; // Use a specific type if known
    application: Application;
}

