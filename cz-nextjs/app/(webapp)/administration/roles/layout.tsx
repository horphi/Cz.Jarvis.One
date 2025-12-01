"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermission="Pages.Administration.Roles">
      {children}
    </PermissionGuard>
  );
}
