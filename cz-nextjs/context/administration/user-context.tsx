"use client";


import { createContext, useContext, useState } from "react";
type UserContextType = {
    id: number | null;
    setId: (id: number | null) => void;

    firstName: string;
    setFirstName: (name: string) => void;

    surName: string;
    setSurName: (name: string) => void;

    userName: string;
    setUserName: (name: string) => void;

    emailAddress: string;
    setEmailAddress: (email: string) => void;

    password: string;
    setPassword: (password: string) => void;

    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;

    shouldChangePasswordOnNextLogin: boolean;
    setShouldChangePasswordOnNextLogin: (shouldChange: boolean) => void;

    isTwoFactorEnabled: boolean;
    setIsTwoFactorEnabled: (isTwoFactorEnabled: boolean) => void;

    assignedRoleNames: string[];
    setAssignedRoleNames: React.Dispatch<React.SetStateAction<string[]>>;

    sendActivationEmail: boolean;
    setSendActivationEmail: (sendActivationEmail: boolean) => void;

    setRandomPassword: boolean;
    setSetRandomPassword: (setRandomPassword: boolean) => void;

    isActive: boolean;
    setIsActive: (isActive: boolean) => void;

    isLockoutEnabled: boolean;
    setIsLockoutEnabled: (isLockoutEnabled: boolean) => void;



}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function CreateOrEditUserProvider({ children }: { children: React.ReactNode }) {
    const [id, setId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState("");
    const [surName, setSurName] = useState("");
    const [userName, setUserName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [shouldChangePasswordOnNextLogin, setShouldChangePasswordOnNextLogin] = useState(false);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [assignedRoleNames, setAssignedRoleNames] = useState<string[]>([]);
    const [sendActivationEmail, setSendActivationEmail] = useState(false);
    const [setRandomPassword, setSetRandomPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLockoutEnabled, setIsLockoutEnabled] = useState(false);
    return (
        <UserContext.Provider value={{
            id, setId,
            firstName, setFirstName,
            surName, setSurName,
            userName, setUserName,
            emailAddress, setEmailAddress,
            password, setPassword,
            phoneNumber, setPhoneNumber,
            shouldChangePasswordOnNextLogin, setShouldChangePasswordOnNextLogin,
            isTwoFactorEnabled, setIsTwoFactorEnabled,
            assignedRoleNames, setAssignedRoleNames,
            sendActivationEmail, setSendActivationEmail,
            setRandomPassword, setSetRandomPassword,
            isActive, setIsActive,
            isLockoutEnabled, setIsLockoutEnabled
        }}>
            {children}
        </UserContext.Provider>
    );
}
export function useCreateOrEditUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useCreateUserContext must be used within a CreateUserProvider");
    }
    return context;
}



// {
//   "user": {
//     "id": 0,
//     "name": "string",
//     "surname": "string",
//     "userName": "string",
//     "emailAddress": "user@example.com",
//     "phoneNumber": "string",
//     "password": "string",
//     "isActive": true,
//     "shouldChangePasswordOnNextLogin": true,
//     "isTwoFactorEnabled": true,
//     "isLockoutEnabled": true
//   },
//   "assignedRoleNames": [
//     "string"
//   ],
//   "sendActivationEmail": true,
//   "setRandomPassword": true,
// }