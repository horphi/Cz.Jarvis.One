'use client';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PermissionList from "./permission-tree-list";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateOrEditRoleContext } from "@/context/administration/role-context";
import { getTranslations } from "@/lib/i18n";
import React, { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RoleFormProps {
    t: Awaited<ReturnType<typeof getTranslations>>;
    param: number | null;
}

export default function RoleForm({ t, param }: RoleFormProps) {
    const { setId, roleName, setRoleName, isDefault, setIsDefault, selectedPermissions, setPermissions } = useCreateOrEditRoleContext();
    const router = useRouter();

    const fetchRole = useCallback(async () => {
        if (param && param > 0) {
            try {
                const response = await fetch("/api/administration/role/get-role", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: param }),
                });
                const responseData = await response.json();
                if (responseData.success) {
                    const editData = responseData.data;
                    if (editData) {
                        setId(param);
                        setRoleName(editData.role.displayName);
                        setIsDefault(editData.role.isDefault);
                        // Set permissions if available in editData
                        if (editData.permissions) {
                            setPermissions(editData.grantedPermissionNames);
                        }
                    }
                } else {

                    toast.error(responseData.message || "Failed to retrieve role.");
                    setTimeout(() => {
                        router.push("/administration/roles");
                    }, 1200);
                }

            } catch (error) {
                console.error("Failed to delete Role", error);
                toast.error("An error occurred while deleting the role.");
            } finally {
                //setLoading(false);
            }
        }

    }, [param, router, setId, setIsDefault, setPermissions, setRoleName]);

    useEffect(() => {
        fetchRole();
    }, [fetchRole]
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:space-x-8 px-2 ">
                {/* RoleContent */}
                <div className="flex-1 flex flex-col justify-start">
                    <div className="mb-4  space-x-2">
                        <Label htmlFor="role-name" className="block mb-2 font-medium">
                            {t.administration.role.roleName}:
                            <span className="text-red-500"> *</span>
                        </Label>
                        <Input
                            id="role-name"
                            required={true}
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder={t.administration.role.roleName}
                            className="w-full mb-4 p-2 border border-gray-300 rounded-md max-w-xl"
                        />
                    </div>
                    {/* Make checkbox and label inline */}
                    <div className="mb-4 flex items-center space-x-2">
                        <Checkbox
                            id="default-role"
                            checked={!!isDefault}
                            onCheckedChange={(checked) => setIsDefault(checked === true)}
                        />
                        <Label htmlFor="default-role" className="font-medium">
                            {t.administration.role.default}
                        </Label>
                    </div>
                    <div className="text-sm text-gray-500 ml-6">
                        <p>
                            {t.administration.role.defaultRoleDescription}
                        </p>
                    </div>
                </div>
                {/*Permission */}
                <div className="flex-1 flex flex-col justify-start">
                    <Label className="block mb-2 font-medium">
                        {t.administration.role.permissions}:
                        <span className="text-red-500"> *</span>
                    </Label>
                    <div className="border border-gray-300 rounded-md p-4 h-fit overflow-y-auto">
                        <PermissionList
                            selectedPermissions={selectedPermissions}
                            onSelect={setPermissions}
                        />
                    </div>
                </div>

            </div>
        </div >

    );
}
