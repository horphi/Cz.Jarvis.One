"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "@/lib/i18n";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import React, { useEffect, useState, useCallback } from "react"; // Import useRef
import { RoleListDto, TRole, UserRoleDto } from "@/types/roles/i-role";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/types/http/api-result";
import { GetUserForEditDto } from "@/types/users/user-type";

interface UserFormProps {
    t: Awaited<ReturnType<typeof getTranslations>>;
    param: number | null;
}


export default function EditUserForm({ t, param }: UserFormProps) {
    const logIdentifier = "EditUserForm";
    const router = useRouter();
    const [roleOptions, setRoleOptions] = useState<TRole[]>([]); // List of roles for checkboxes
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
        confirmPassword, setConfirmPassword,
        isActive, setIsActive,
        isLockoutEnabled, setIsLockoutEnabled
    } = useCreateOrEditUserContext();


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
                toast.error("An error occurred while processing your request. Please try again.");
            }
        };
        fetchRolesAndSetOptions();
    }, [router]); // Runs once on mount to fetch roles

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
                const responseResult: ApiResult<GetUserForEditDto> = await response.json();
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
                    const editData = responseResult.data;
                    if (editData) {
                        setId(param);
                        setFirstName(editData.user.name);
                        setSurName(editData.user.surname);
                        setUserName(editData.user.userName);
                        setEmailAddress(editData.user.emailAddress);
                        setPassword(editData.user.password || "");
                        setShouldChangePasswordOnNextLogin(editData.user.shouldChangePasswordOnNextLogin);
                        setIsTwoFactorEnabled(editData.user.isTwoFactorEnabled);
                        const assignedRoles = (editData.roles || [])
                            .filter((role: UserRoleDto) => role.isAssigned)
                            .map((role: UserRoleDto) => role.roleName);
                        setAssignedRoleNames(assignedRoles);
                        setIsActive(editData.user.isActive);
                        setIsLockoutEnabled(editData.user.isLockoutEnabled);
                    }
                    else {
                        toast.error(responseResult.message || "Failed to process your request", {
                            description: responseResult.error || "Please try again."
                        });
                        setTimeout(() => {
                            router.push("/administration/users");
                        }, 1200);
                    }
                }
            } catch (error) {
                console.error("EditUserForm:", error);
                toast.error("An error occurred while processing your request. Please try again.");
            } finally {
                //setLoading(false);
            }
        }
    }, [param, router, setId, setFirstName, setSurName, setUserName, setEmailAddress, setPassword, setShouldChangePasswordOnNextLogin, setIsTwoFactorEnabled, setAssignedRoleNames, setIsActive, setIsLockoutEnabled]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);



    return (
        <>
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
                            type="password" // Added type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md max-w-md"
                        />
                    </div>
                    {/* Confirm Password Field */}
                    <div className=" mb-4 space-y-2">
                        <Label htmlFor="confirm-password" className="block font-medium">
                            Confirm Password:<span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="confirm-password"
                            type="password" // Added type="password"
                            value={confirmPassword || ""}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md max-w-md"
                        />
                        {/* Reminder: Password matching check should be done on form submission */}
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