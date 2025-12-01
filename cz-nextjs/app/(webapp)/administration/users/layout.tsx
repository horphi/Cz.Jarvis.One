"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard requiredPermission="Pages.Administration.Users">
      {children}
    </PermissionGuard>
  );
}
