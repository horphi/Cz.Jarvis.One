"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "@/lib/i18n";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import React, { useEffect, useState, useRef, useCallback } from "react"; // Import useRef
import { IRole } from "@/types/roles/i-role";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserFormProps {
    t: Awaited<ReturnType<typeof getTranslations>>;
    param: number | null;
}


export default function CreateUserForm({ t, param }: UserFormProps) {
    const router = useRouter();

    const {
        setId,
        firstName, setFirstName,
        surName, setSurName,
        userName, setUserName,
        emailAddress, setEmailAddress,
        password, setPassword,
        shouldChangePasswordOnNextLogin, setShouldChangePasswordOnNextLogin,
        isTwoFactorEnabled, setIsTwoFactorEnabled,
        assignedRoleNames, setAssignedRoleNames,
        sendActivationEmail, setSendActivationEmail,
        setRandomPassword, setSetRandomPassword,
        isActive, setIsActive,
        isLockoutEnabled, setIsLockoutEnabled
    } = useCreateOrEditUserContext();

    const [roleOptions, setRoleOptions] = useState<{ id: number; name: string; displayName: string; isDefault: boolean }[]>([]);
    const initialDefaultRolesProcessed = useRef(false); // Ref to track if initial defaults have been processed

    const fetchUser = useCallback(async () => {
        if (param && param > 0) {
            try {
                const response = await fetch("/api/administration/user/get-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: param }),
                });
                const responseData = await response.json();
                console.log(responseData);

                if (responseData.success) {
                    const editData = responseData.data;
                    if (editData) {
                        setId(param);
                        setFirstName(editData.user.name);
                        setSurName(editData.user.surname);
                        setUserName(editData.user.userName);
                        setEmailAddress(editData.user.emailAddress);
                        setPassword(editData.user.password);
                        setShouldChangePasswordOnNextLogin(editData.user.shouldChangePasswordOnNextLogin);
                        setIsTwoFactorEnabled(editData.user.isTwoFactorEnabled);
                        setAssignedRoleNames(editData.assignedRoleNames || []);
                        setSendActivationEmail(editData.user.sendActivationEmail);
                        setSetRandomPassword(editData.user.setRandomPassword);
                        setIsActive(editData.user.isActive);
                        setIsLockoutEnabled(editData.user.isLockoutEnabled);
                    }
                } else {
                    toast.error(responseData.message || "Failed to retrieve user.");
                    setTimeout(() => {
                        router.push("/administration/users");
                    }, 1200);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                toast.error("An error occurred while fetching the user.");
                setTimeout(() => {
                    router.push("/administration/users");
                }, 1200);
            } finally {
                //setLoading(false);
            }
        }
    }, [param, router, setId, setFirstName, setSurName, setUserName, setEmailAddress, setPassword, setShouldChangePasswordOnNextLogin, setIsTwoFactorEnabled, setAssignedRoleNames, setSendActivationEmail, setSetRandomPassword, setIsActive, setIsLockoutEnabled]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        // Fetch roles for checkbox list
        const fetchRolesAndSetOptions = async () => {
            try {
                const response = await fetch("/api/administration/role/get-roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Permissions: [] }),
                });
                if (!response.ok) throw new Error("Failed to fetch roles");
                const data = await response.json();
                const newRoleOptions = (data.data?.items ?? []).map((role: IRole) => ({
                    id: role.id,
                    name: role.name,
                    displayName: role.displayName || role.name,
                    isDefault: role.isDefault,
                }));
                setRoleOptions(newRoleOptions);
                initialDefaultRolesProcessed.current = false; // Reset flag when new roles are fetched
            } catch (error) {
                console.error(error);
                setRoleOptions([]);
            }
        };
        fetchRolesAndSetOptions();
    }, []); // Runs once on mount to fetch roles

    // Effect to set default assigned roles once roleOptions are available
    useEffect(() => {
        // Only process if roleOptions are loaded and initial defaults for this set haven't been processed
        if (roleOptions.length > 0 && !initialDefaultRolesProcessed.current) {
            const defaultRoleNames = roleOptions
                .filter(role => role.isDefault)
                .map(role => role.name);

            if (defaultRoleNames.length > 0) {
                setAssignedRoleNames((prevAssignedRoleNames: string[]) => {
                    const currentAssigned = new Set(prevAssignedRoleNames);
                    let changed = false;
                    for (const name of defaultRoleNames) {
                        if (!currentAssigned.has(name)) {
                            currentAssigned.add(name);
                            changed = true;
                        }
                    }
                    // Only return a new array if something actually changed to prevent unnecessary re-renders.
                    return changed ? Array.from(currentAssigned) : prevAssignedRoleNames;
                });
            }
            initialDefaultRolesProcessed.current = true; // Mark that defaults for this roleOptions set have been processed
        }
    }, [roleOptions, setAssignedRoleNames]); // Runs when roleOptions or setAssignedRoleNames changes


    return (<>

        <div className="flex flex-row sm:space-x-8 px-2 mb-4">
            {/* Right col */}
            <div className="flex-1 flex flex-col justify-start px-2">
                {/* UserName */}
                <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    <div className="flex-1 mb-4 space-y-2">
                        <Label htmlFor="user-name" className="block font-medium">
                            Username:<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="user-name"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            className=" p-2 border border-gray-300 rounded-md max-w-md"
                        />
                    </div>
                    <div className=" flex-1 mb-4 space-y-2">
                        <Label htmlFor="email" className="block font-medium">
                            Email:<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={emailAddress}
                            onChange={e => setEmailAddress(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md max-w-md"
                        />
                    </div>

                </div>

                {/* First Name and Surname in the same row */}
                <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">

                    <div className="flex-1 mb-4 space-y-2">
                        <Label htmlFor="first-name" className="block font-medium">
                            First Name:<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="first-name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md max-w-md"
                        />
                    </div>

                    <div className="flex-1 mb-4 space-y-2">
                        <Label htmlFor="surname" className="block font-medium">
                            Surname:<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="surname"
                            value={surName}
                            onChange={e => setSurName(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md max-w-md"
                        />
                    </div>

                </div>
                {/* First Name and Surname in the same row */}
                {/* <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                </div> */}

                <div className=" mb-4 space-y-2">
                    <Label htmlFor="password" className="block font-medium">
                        Password:<span className="text-red-500"> *</span>
                    </Label>
                    <Input
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md max-w-md"
                    />
                </div>


                <div className="mb-4 flex items-center space-x-2 px-4">
                    <Checkbox
                        id="is-active"
                        checked={!!isActive}
                        onCheckedChange={checked => setIsActive(checked === true)}
                    />
                    <Label htmlFor="is-active" className="font-medium">
                        Active
                    </Label>

                </div>
                <div className="mb-4 flex items-center space-x-2 px-4">

                    <Checkbox
                        id="is-lockout-enabled"
                        checked={!!isLockoutEnabled}
                        onCheckedChange={checked => setIsLockoutEnabled(checked === true)}
                    />
                    <Label htmlFor="is-lockout-enabled" className="font-medium">
                        Lockout Enabled
                    </Label>

                </div>
                <div className="mb-4 flex items-center space-x-2 px-4">
                    <Checkbox
                        id="should-change-password"
                        checked={!!shouldChangePasswordOnNextLogin}
                        onCheckedChange={checked => setShouldChangePasswordOnNextLogin(checked === true)}
                    />
                    <Label htmlFor="should-change-password" className="font-medium">
                        Should Change Password On Next Login
                    </Label>
                </div>
                <div className="mb-4 flex items-center space-x-2 px-4">
                    <Checkbox
                        id="is-two-factor-enabled"
                        checked={!!isTwoFactorEnabled}
                        onCheckedChange={checked => setIsTwoFactorEnabled(checked === true)}
                    />
                    <Label htmlFor="is-two-factor-enabled" className="font-medium">
                        Two Factor Enabled
                    </Label>
                </div>
                <div className="mb-4 flex items-center space-x-2 px-4">
                    <Checkbox
                        id="send-activation-email"
                        checked={!!sendActivationEmail}
                        onCheckedChange={checked => setSendActivationEmail(checked === true)}
                    />
                    <Label htmlFor="send-activation-email" className="font-medium">
                        Send Activation Email
                    </Label>
                </div>
                <div className="mb-4 flex items-center space-x-2 px-4">
                    <Checkbox
                        id="set-random-password"
                        checked={!!setRandomPassword}
                        onCheckedChange={checked => setSetRandomPassword(checked === true)}
                    />
                    <Label htmlFor="set-random-password" className="font-medium">
                        Set Random Password
                    </Label>
                </div>

            </div>

            {/* Left col */}
            <div className="flex-1 flex flex-col justify-start px-2">
                <Label className="block mb-2 font-medium">
                    {t.administration.role?.roleName || "Roles"}
                </Label>
                {roleOptions.map(role => (
                    <div key={role.id} className="flex items-center space-x-2 mb-4 px-4">
                        <Checkbox
                            className=""
                            id={`role-checkbox-${role.id}`}
                            checked={assignedRoleNames.includes(role.name)}
                            onCheckedChange={checked => {
                                if (checked) {
                                    setAssignedRoleNames((prev: string[]) => [...prev, role.name]);
                                } else {
                                    setAssignedRoleNames((prev: string[]) => prev.filter(r => r !== role.name));
                                }
                            }}
                        />
                        <Label htmlFor={`role-checkbox-${role.id}`} className="font-medium">
                            {role.displayName}
                            {role.isDefault && (
                                <span className="ml-2 text-xs text-green-600">(Default)</span>
                            )}
                        </Label>
                    </div>
                ))}
            </div>
        </div >

    </>);
}