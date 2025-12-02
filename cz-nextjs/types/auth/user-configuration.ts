/**
 * ABP User Configuration Types
 * Response from /AbpUserConfiguration/GetAll endpoint
 */

export interface AbpUserConfigurationResponse {
  result: AbpUserConfiguration;
  targetUrl: string | null;
  success: boolean;
  error: AbpError | null;
  unAuthorizedRequest: boolean;
  _cz_: boolean;
}

export interface AbpError {
  code?: number;
  message?: string;
  details?: string;
  validationErrors?: AbpValidationError[];
}

export interface AbpValidationError {
  message: string;
  members: string[];
}

export interface AbpUserConfiguration {
  multiTenancy: AbpMultiTenancy;
  session: AbpSession;
  localization: AbpLocalization;
  auth: AbpAuth;
  nav: AbpNav;
  setting: AbpSetting;
  clock: AbpClock;
  timing: AbpTiming;
  security: AbpSecurity;
  custom: AbpCustom;
}

// Multi-Tenancy
export interface AbpMultiTenancy {
  isEnabled: boolean;
  ignoreFeatureCheckForHostUsers: boolean;
  sides: {
    host: number;
    tenant: number;
  };
}

// Session
export interface AbpSession {
  userId: number | null;
  tenantId: number | null;
  impersonatorUserId: number | null;
  impersonatorTenantId: number | null;
  multiTenancySide: number;
}

// Localization
export interface AbpLocalization {
  currentCulture: AbpCulture;
  languages: AbpLanguage[];
  currentLanguage: AbpLanguage;
  sources: AbpLocalizationSource[];
  values: Record<string, Record<string, string>>;
}

export interface AbpCulture {
  name: string;
  displayName: string;
}

export interface AbpLanguage {
  name: string;
  displayName: string;
  icon: string;
  isDefault: boolean;
  isDisabled: boolean;
  isRightToLeft: boolean;
}

export interface AbpLocalizationSource {
  name: string;
  type: string;
}

// Auth
export interface AbpAuth {
  allPermissions: Record<string, string>;
  grantedPermissions: Record<string, string>;
}

// Navigation
export interface AbpNav {
  menus: Record<string, AbpMenu>;
}

export interface AbpMenu {
  name: string;
  displayName: string;
  customData: unknown;
  items: AbpMenuItem[];
}

export interface AbpMenuItem {
  name: string;
  displayName: string;
  icon?: string;
  url?: string;
  customData?: unknown;
  items?: AbpMenuItem[];
}

// Settings
export interface AbpSetting {
  values: Record<string, string>;
}

// Clock
export interface AbpClock {
  provider: string;
}

// Timing
export interface AbpTiming {
  timeZoneInfo: AbpTimeZoneInfo;
}

export interface AbpTimeZoneInfo {
  windows: {
    timeZoneId: string;
    baseUtcOffsetInMilliseconds: number;
    currentUtcOffsetInMilliseconds: number;
    isDaylightSavingTimeNow: boolean;
  };
  iana: {
    timeZoneId: string;
  };
}

// Security
export interface AbpSecurity {
  antiForgery: {
    tokenCookieName: string;
    tokenHeaderName: string;
  };
}

// Custom
export interface AbpCustom {
  EntityHistory?: {
    isEnabled: boolean;
    enabledEntities: string[] | null;
  };
  [key: string]: unknown;
}
