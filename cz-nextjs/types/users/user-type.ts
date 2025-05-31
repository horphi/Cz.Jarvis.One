import { UserRoleDto } from "../roles/i-role";

export type TUserForListDto = {
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  lockoutEndDateUtc: Date | null;
  phoneNumber: string | null;
  profilePictureId: number | null;
  isEmailConfirmed: boolean;
  roles: {
    roleId: number;
    roleName: string;
  }[];
  isActive: boolean;
  creationTime: Date;
  id: number;
};

export type TUserSession = {
  user: TUserLoginInfo | null;
  impersonatorUser: TUserLoginInfo | null;
  //application
};

export type TUserLoginInfo = {
  userName: string;
  name: string;
  surname: string;
  emailAddress: string;
  profilePictureId: string | null;
  loginType: string;
};

export type UserListDto = {
  totalCount: number;
  items: TUserForListDto[];
};

export type GetUserForEditDto = {
  user: TUser;
  roles: UserRoleDto[];
  profilePictureId: string | null;
};

export type TUser = {
  id: number;
  name: string;
  surname: string;
  userName: string;
  emailAddress: string;
  phoneNumber: string | null;
  password?: string; // Optional for edit operations
  isActive: boolean;
  shouldChangePasswordOnNextLogin: boolean;
  isTwoFactorEnabled: boolean;
  isLockoutEnabled: boolean;
};
