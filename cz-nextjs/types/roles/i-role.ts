export type TRole = {
  name: string;
  displayName: string;
  isStatic: boolean;
  isDefault: boolean;
  creationTime: Date;
  id: number;
};

export type TCreateOrEditRole = {
  role: TRole;
  //permissions: string[];
  grantedPermissionNames: string[];
};

export type UserRoleDto = {
  roleId: number;
  roleName: string;
  roleDisplayName: string;
  isAssigned: boolean;
};

export type RoleListDto = {
  items: TRole[];
};
