export type TUser = {
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
