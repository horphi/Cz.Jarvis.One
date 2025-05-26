export interface IRole {
  name: string;
  displayName: string;
  isStatic: boolean;
  isDefault: boolean;
  creationTime: Date;
  id: number;
}

export interface IPermission {
  name: string;
  displayName: string;
  parentName: string | null;
  level: number;
  isGrantedbyDefault: boolean;
}

export type CreateOrEditRoleType = {
  role: IRole;
  permissions: string[];
};
