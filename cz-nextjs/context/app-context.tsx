"use client";

import { TUserLoginInfo } from "@/types/users/user-type";
import { createContext, useContext, useState } from "react";
type AppContextType = {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
    // firstName: string;
    // setFirstName: (name: string) => void;
    // surName: string;
    // setSurName: (name: string) => void;
    // userName: string;
    // setUserName: (name: string) => void;
    // emailAddress: string;
    // setEmailAddress: (email: string) => void;
    // userId: number | null;
    // setUserId: (id: number | null) => void;
    //loginType: string;
    //setLoginType: (loginType: string) => void;
    userSession: TUserLoginInfo | null;
    setUserSession: (user: TUserLoginInfo | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);



export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    // const [firstName, setFirstName] = useState("");
    // const [surName, setSurName] = useState("");
    // const [userName, setUserName] = useState("");
    // const [emailAddress, setEmailAddress] = useState("");
    // const [userId, setUserId] = useState<number | null>(null);
    // const [loginType, setLoginType] = useState("default");
    const [userSession, setUserSession] = useState<TUserLoginInfo | null>(null);
    return (
        <AppContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
                // firstName,
                // setFirstName,
                // surName,
                // setSurName,
                // userName,
                // setUserName,
                // emailAddress,
                // setEmailAddress,
                // userId,
                // setUserId,
                //loginType,
                //setLoginType,
                userSession,
                setUserSession
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}