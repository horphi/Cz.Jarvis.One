export interface NavUser {
  name: string;
  email: string;
  avatar: string;
}

export interface NavTeam {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  hideWhenNoAccess?: boolean; // If true, hide the item when user doesn't have access
}

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
  requiredPermissions?: string[];
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string; requiredPermissions?: string[]; hideWhenNoAccess?: boolean })[];
  url?: never;
  requiredPermissions?: string[];
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: NavItem[];
  requiredRoles?: string[]; // Optional array of roles required to see this group
  requiredPermissions?: string[]; // Optional array of permissions required to see this group
  hideWhenNoAccess?: boolean; // If true, hide entire group when user doesn't have access
}

export type { NavItem, NavGroup, NavLink, NavCollapsible };
