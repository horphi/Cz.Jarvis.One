"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";

export default function AuditLogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermission="Pages.Administration.AuditLogs">
      {children}
    </PermissionGuard>
  );
}
