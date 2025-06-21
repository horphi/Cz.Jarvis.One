export type TAuditLog = {
  id: number;
  userId?: number | null;
  userName?: string | null;
  impersonatorTenantId?: number | null;
  impersonatorUserId?: number | null;
  serviceName?: string | null;
  methodName?: string | null;
  parameters?: string | null;
  executionTime: Date;
  executionDuration: number; // in milliseconds
  clientIpAddress?: string | null;
  clientName?: string | null;
  browserInfo?: string | null;
  exception?: string | null;
  customData?: string | null;
};

export type AuditLogListDto = {
  totalCount: number;
  items: TAuditLog[];
};
