"use client";

import { createContext, useContext, useState } from "react";

type RoleContextType = {
    id: number | null;
    setId: (id: number | null) => void;
    roleName: string;
    setRoleName: (name: string) => void;
    isDefault: boolean;
    setIsDefault: (isDefault: boolean) => void;
    selectedPermissions: string[];
    setPermissions: (permissions: string[]) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function CreateRoleProvider({ children }: { children: React.ReactNode }) {
    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setPermissions] = useState<string[]>([]);
    const [isDefault, setIsDefault] = useState(false);
    const [id, setId] = useState<number | null>(null);

    return (
        <RoleContext.Provider value={{ id, setId, roleName, setRoleName, selectedPermissions, setPermissions, isDefault, setIsDefault }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useCreateRoleContext() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRoleContext must be used within a RoleProvider");
    }
    return context;
}