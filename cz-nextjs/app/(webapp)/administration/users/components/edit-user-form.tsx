"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "@/lib/i18n";
import { useCreateOrEditUserContext } from "@/context/administration/user-context";
import React, { useEffect, useState, useCallback } from "react"; // Import useRef
import { UserRoleDto } from "@/types/roles/i-role";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserFormProps {
    t: Awaited<ReturnType<typeof getTranslations>>;
    param: number | null;
}


export default function EditUserForm({ t, param }: UserFormProps) {
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

    const [roleOptions, setRoleOptions] = useState<{ roleId: number; roleName: string; roleDisplayName: string; isAssigned: boolean }[]>([]);
    const [confirmPassword, setConfirmPassword] = useState(""); // Added for confirm password

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
                        setPassword(editData.user.password || "");
                        setShouldChangePasswordOnNextLogin(editData.user.shouldChangePasswordOnNextLogin);
                        setIsTwoFactorEnabled(editData.user.isTwoFactorEnabled);
                        setRoleOptions(editData.roles || []);
                        // Set assigned role names based on isAssigned property
                        const assignedRoles = (editData.roles || [])
                            .filter((role: UserRoleDto) => role.isAssigned)
                            .map((role: UserRoleDto) => role.roleName);
                        setAssignedRoleNames(assignedRoles);
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
                    <div key={role.roleId} className="flex items-center space-x-2 mb-4 px-4">
                        <Checkbox
                            className=""
                            id={`role-checkbox-${role.roleId}`}
                            checked={assignedRoleNames.includes(role.roleName)}
                            onCheckedChange={checked => {
                                if (checked) {
                                    setAssignedRoleNames((prev: string[]) => [...prev, role.roleName]);
                                } else {
                                    setAssignedRoleNames((prev: string[]) => prev.filter(r => r !== role.roleName));
                                }
                            }}
                        />
                        <Label htmlFor={`role-checkbox-${role.roleId}`} className="font-medium">
                            {role.roleDisplayName}
                        </Label>
                    </div>
                ))}
            </div>
        </div >

    </>);
}