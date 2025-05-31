"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "@/lib/i18n";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import React, { useEffect, useState } from "react"; // Import useRef
import { RoleListDto, TRole } from "@/types/roles/i-role";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResult } from "@/types/http/api-result";

interface UserFormProps {
    t: Awaited<ReturnType<typeof getTranslations>>;
    param: number | null;
}


export default function CreateUserForm({ t, param }: UserFormProps) {
    const logIdentifier = "CreateUserForm";
    const router = useRouter();

    console.log(param);
    const {
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

    const [roleOptions, setRoleOptions] = useState<TRole[]>([]); // List of roles for checkboxes
    // const initialDefaultRolesProcessed = useRef(false); // Ref to track if initial defaults have been processed


    useEffect(() => {
        // Fetch roles for checkbox list
        const fetchRolesAndSetOptions = async () => {
            try {
                const response = await fetch("/api/administration/role/get-roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Permissions: [] }),
                });

                const responseResult: ApiResult<RoleListDto> = await response.json();
                // Unauthorized, redirect to login
                if (response.status === 401) { router.push('/login'); }

                if (!responseResult.success) {
                    toast.error(responseResult.message || "Failed to process your request", {
                        description: responseResult.error || "Please try again."
                    });
                    setTimeout(() => {
                        router.push("/administration/users");
                    }, 1200);
                } else {
                    // Response is Successful
                    const newRoleOptions: TRole[] = responseResult.data?.items || [];
                    setRoleOptions(newRoleOptions);
                }
            } catch (error) {
                console.error(`${logIdentifier}:`, error);
                setRoleOptions([]);
            }
        };
        fetchRolesAndSetOptions();
    }, [router]); // Runs once on mount to fetch roles

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