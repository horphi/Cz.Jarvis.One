export interface IPermission {
  level: number;
  parentName: string | null;
  name: string;
  displayName: string;
  description: string | null;
  isGrantedByDefault: boolean;
}

export interface IPermissionWithChildren extends IPermission {
  children: IPermissionWithChildren[];
}
