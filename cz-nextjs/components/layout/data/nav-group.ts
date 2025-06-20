import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUserShield,
  IconFolderExclamation,
  IconSettings,
  IconWorldCog,
  IconUsers,
} from "@tabler/icons-react";
import { NavGroup } from "../types";

export const navGroupData: NavGroup[] = [
  {
    title: "Administration",
    requiredRoles: ["admin", "administrator"], // Only admins can see this section
    items: [
      {
        title: "Dashboard",
        url: "/administration/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Roles",
        url: "/administration/roles",
        icon: IconLayoutDashboard,
      },
      {
        title: "Users",
        url: "/administration/users",
        icon: IconUserShield,
      },
      {
        title: "Audit Logs",
        url: "/administration/audit-logs",
        icon: IconFolderExclamation,
      },
      {
        title: "Entity Changes",
        url: "/administration/entity-changes",
        icon: IconFolderExclamation,
      },
      {
        title: "Settings",
        url: "/administration/settings",
        //   badge: "3",
        icon: IconSettings,
      },
      {
        title: "Maintainance",
        url: "/administration/maintainance",
        icon: IconWorldCog,
      },
      {
        title: "Horphi",
        url: "/horphi",
        icon: IconUsers,
      },
      {
        title: "Impersonation",
        url: "/administration/impersonation",
        icon: IconUserOff,
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconLayoutDashboard,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: IconChecklist,
      },
      {
        title: "Apps",
        url: "/apps",
        icon: IconPackages,
      },
      {
        title: "Chats",
        url: "/chats",
        badge: "3",
        icon: IconMessages,
      },
      {
        title: "Users",
        url: "/users",
        icon: IconUsers,
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "Auth",
        icon: IconLockAccess,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
          {
            title: "Sign In (2 Col)",
            url: "/auth/sign-in-2",
          },
          {
            title: "Sign Up",
            url: "/sign-up",
          },
          {
            title: "Forgot Password",
            url: "/forgot-password",
          },
          {
            title: "OTP",
            url: "/otp",
          },
        ],
      },
      {
        title: "Errors",
        icon: IconBug,
        items: [
          {
            title: "Unauthorized",
            url: "/401",
            icon: IconLock,
          },
          {
            title: "Forbidden",
            url: "/403",
            icon: IconUserOff,
          },
          {
            title: "Not Found",
            url: "/404",
            icon: IconError404,
          },
          {
            title: "Internal Server Error",
            url: "/500",
            icon: IconServerOff,
          },
          {
            title: "Maintenance Error",
            url: "/503",
            icon: IconBarrierBlock,
          },
        ],
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        title: "Settings",
        icon: IconSettings,
        items: [
          {
            title: "Profile",
            url: "/settings",
            icon: IconUserCog,
          },
          {
            title: "Account",
            url: "/settings/account",
            icon: IconTool,
          },
          {
            title: "Appearance",
            url: "/settings/appearance",
            icon: IconPalette,
          },
          {
            title: "Notifications",
            url: "/settings/notifications",
            icon: IconNotification,
          },
          {
            title: "Display",
            url: "/settings/display",
            icon: IconBrowserCheck,
          },
        ],
      },
      {
        title: "Help Center",
        url: "/help-center",
        icon: IconHelp,
      },
    ],
  },
];
