'use client';
import { Button } from "@/components/ui/button";
import { useCreateOrEditRoleContext } from "@/context/administration/role-context";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiResult } from "@/types/http/api-result";

export default function SaveRoleButton() {
    const logIdentifier = "SaveRoleButton";
    const { id, roleName, isDefault, selectedPermissions } = useCreateOrEditRoleContext();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);



    const handleSubmit = async () => {
        setSubmitting(true);

        if (!roleName) {
            toast.error("Role name is required.");
            setSubmitting(false);
            return;
        }

        if (selectedPermissions.length === 0) {
            toast.error("At least one permission is required.");
            setSubmitting(false);
            return;
        }

        const requestBody = {
            id: id || null,
            roleName: roleName,
            isDefault: isDefault,
            permissions: selectedPermissions
        };

        try {

            const response = await fetch("/api/administration/role/create-or-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const responseResult: ApiResult<void> = await response.json();

            if (response.status === 401) { router.push('/login'); }

            if (!responseResult.success) {
                toast.error(responseResult.message || "Failed to process your request", {
                    description: responseResult.error || "Please try again."
                });
                return;
            } else {
                // Response is Successful 
                toast.success(responseResult.message || "your request has been successfully processed");
                setTimeout(() => {
                    router.push("/administration/roles");
                }, 1200);
            }
        } catch (error) {
            console.error(`${logIdentifier}:`, error);
            toast.error("An error occurred while processing your request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Save"}
        </Button>
    );
}