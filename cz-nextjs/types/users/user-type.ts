export type User = {
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

// {
//         "name": "admin",
//         "surname": "admin",
//         "userName": "admin",
//         "emailAddress": "admin@defaulttenant.com",
//         "lockoutEndDateUtc": null,
//         "phoneNumber": null,
//         "profilePictureId": null,
//         "isEmailConfirmed": true,
//         "roles": [
//           {
//             "roleId": 2,
//             "roleName": "Admin"
//           }
//         ],
//         "isActive": true,
//         "creationTime": "2025-05-20T12:52:42.258612",
//         "id": 2
//       }
