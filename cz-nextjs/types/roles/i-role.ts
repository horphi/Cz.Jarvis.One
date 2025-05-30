export type TRole = {
  name: string;
  displayName: string;
  isStatic: boolean;
  isDefault: boolean;
  creationTime: Date;
  id: number;
};

// export interface IRole {
//   name: string;
//   displayName: string;
//   isStatic: boolean;
//   isDefault: boolean;
//   creationTime: Date;
//   id: number;
// }

export interface IPermission {
  name: string;
  displayName: string;
  parentName: string | null;
  level: number;
  isGrantedbyDefault: boolean;
}

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

// public class UserRoleDto
// {
//     public int RoleId { get; set; }

//     public string RoleName { get; set; }

//     public string RoleDisplayName { get; set; }

//     public bool IsAssigned { get; set; }

// }
